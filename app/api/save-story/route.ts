import { createClient } from "@/lib/supabase/server";
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

    const formData = await request.formData();

    const audio = formData.get("audio") as File;
    const childName = formData.get("childName") as string;
    const ageRange = formData.get("ageRange") as string;
    const selectedThemes = JSON.parse(formData.get("selectedThemes") as string);
    const feeling = formData.get("feeling") as string;
    const narrator = formData.get("narrator") as string;
    const story = formData.get("story") as string;
    const description = formData.get("description") as string;
    const title = formData.get("title") as string;

    if (!audio || !childName || !ageRange || !story || !description || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const fileName = `${user.id}/${Date.now()}.mp3`;
    const { error: uploadError } = await supabase.storage
      .from("stories")
      .upload(fileName, audio, { contentType: "audio/mpeg" });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("stories").getPublicUrl(fileName);

    const { error: dbError } = await supabase.from("stories").insert({
      user_id: user.id,
      child_name: childName,
      age_range: parseInt(ageRange),
      theme: selectedThemes.join(", "),
      feeling,
      voice_id: narrator,
      story: story,
      audio_url: publicUrl,
      title: title,
      description: description,
    });

    if (dbError) throw dbError;

    return NextResponse.json(
      { message: "Story saved!", publicUrl },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
