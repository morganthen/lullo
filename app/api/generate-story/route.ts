import { generateStoryPrompt } from "@/lib/prompts/generateStoryPrompt";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("generations_used, plan, reset_date")
      .eq("id", user.id)
      .single();

    if (error) throw error;

    const now = new Date();
    const resetDate = new Date(data.reset_date);
    const needsReset =
      now.getMonth() !== resetDate.getMonth() ||
      now.getFullYear() !== resetDate.getFullYear();

    if (needsReset) {
      await supabaseAdmin
        .from("profiles")
        .update({ generations_used: 0, reset_date: now.toISOString() })
        .eq("id", user.id);
      data.generations_used = 0;
    }

    if (data.plan === "free" && data.generations_used >= 3) {
      return NextResponse.json(
        {
          error:
            "Free tier limit reached. Upgrade to Lullo Plus for unlimited stories.",
        },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { childName, ageRange, selectedThemes, feeling, narrator } = body;

    if (!childName || !ageRange || !selectedThemes?.length || !narrator) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = generateStoryPrompt({
      childName,
      ageRange,
      selectedThemes,
      feeling,
      narrator,
    });

    const generatedStory = await client.messages.create({
      max_tokens: 2048,
      model: "claude-haiku-4-5",
      tools: [
        {
          name: "output_story",
          description:
            "Outputs the generated bedtime story with a title and description",
          input_schema: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "Short warm story title, max 6 words",
              },
              description: {
                type: "string",
                description: "One sentence summary for parents, max 20 words",
              },
              story: {
                type: "string",
                description: "The full story text",
              },
            },
            required: ["title", "description", "story"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "output_story" },
      messages: [{ role: "user", content: prompt }],
    });

    const toolUse = generatedStory.content.find(
      (block) => block.type === "tool_use",
    );

    if (!toolUse || toolUse.type !== "tool_use") {
      return NextResponse.json(
        { error: "Story generation failed. Please try again." },
        { status: 500 },
      );
    }

    const { title, description, story } = toolUse.input as {
      title: string;
      description: string;
      story: string;
    };

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ generations_used: data.generations_used + 1 })
      .eq("id", user.id);

    if (updateError) throw updateError;

    return NextResponse.json({ title, description, story }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
