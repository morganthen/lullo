import { generateStoryPrompt } from "@/lib/prompts/generateStoryPrompt";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    //check for user first
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //query their profiles table

    const { data, error } = await supabase
      .from("profiles")
      .select("generations_used, plan")
      .eq("id", user.id)
      .single();

    if (error) throw error; //create more granular error message for better debugging in the future

    if (data.plan === "free" && data.generations_used >= 3) {
      return NextResponse.json(
        {
          error:
            "Free tier limit reached. Upgrade to Lullo Plus for unlimited stories.",
        },
        { status: 403 },
      );
    }

    //1. parse request body as JSON
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
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
      model: "claude-haiku-4-5",
    });

    const storyText =
      generatedStory.content[0].type === "text"
        ? generatedStory.content[0].text
        : "";

    //update generations used here
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ generations_used: data.generations_used + 1 })
      .eq("id", user.id);

    if (updateError) throw updateError; // better error handling here for better debugging in the future

    return NextResponse.json({ storyText }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
