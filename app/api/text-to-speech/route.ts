import { ElevenLabsClient } from "elevenlabs";
import { NextResponse } from "next/server";
import { buffer } from "node:stream/consumers";
import { voiceMap } from "@/lib/voices";

export async function POST(request: Request) {
  try {
    //parse request body as json
    const body = await request.json();
    const { storyText, narrator } = body;
    const voiceId = voiceMap[narrator] ?? voiceMap["warm"];

    if (!storyText || !voiceId) {
      return NextResponse.json(
        { error: "Missing storyText or voiceId" },
        { status: 400 },
      );
    }

    const client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });

    const audio = await client.textToSpeech.convert(voiceId, {
      text: storyText,
      model_id: "eleven_turbo_v2",
      output_format: "mp3_44100_128",
      voice_settings: {
        stability: 1,
        similarity_boost: 1,
        style: 0,
        speed: 0.7,
      },
    });

    const buf = await buffer(audio);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buf.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
