import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { storyId, audioUrl } = await request.json();
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error: deleteError } = await supabase
      .from("stories")
      .delete()
      .eq("id", storyId);

    if (deleteError) throw deleteError;

    //delete from storage
    const path = audioUrl.split("/storage/v1/object/public/stories/")[1];

    const { error: storageDeleteError } = await supabase.storage
      .from("stories")
      .remove([path]);

    if (storageDeleteError) throw storageDeleteError;

    return NextResponse.json({ message: "Story deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong while deleting the story." },
      { status: 500 },
    );
  }
}
