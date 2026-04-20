import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (error) throw Error("Something went wrong");
    return NextResponse.json(
      { msg: "User succesfully deleted" },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Something went wrong while deleting account." },
      { status: 500 },
    );
  }
}
