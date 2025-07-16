import { kv } from "@vercel/kv";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import Ably from "ably";

const RADIO_STATE_KEY = "radio:state";

interface RadioState {
  songId: string;
  startTime: number;
  song: {
    id: string;
    title: string;
    artist: string;
    youtubeId: string;
    duration: number;
  };
}

// Inicializa o Ably no servidor
const ably = new Ably.Rest(process.env.ABLY_API_KEY!);

export async function GET() {
  try {
    const currentState = await kv.get<RadioState>(RADIO_STATE_KEY);
    const now = Date.now();
    let needsNewSong = true;

    if (currentState) {
      const songEndTime =
        currentState.startTime + currentState.song.duration * 1000;
      if (now < songEndTime) {
        needsNewSong = false;
      }
    }

    if (needsNewSong) {
      const musicCount = await prisma.music.count({
        where: { status: "approved" },
      });
      const skip = Math.floor(Math.random() * musicCount);
      const randomSong = await prisma.music.findFirst({
        where: { status: "approved" },
        skip: skip,
      });

      if (!randomSong) {
        return NextResponse.json(
          { error: "Nenhuma música encontrada." },
          { status: 404 }
        );
      }

      const newState: RadioState = {
        songId: randomSong.id,
        startTime: now,
        song: {
          id: randomSong.id,
          title: randomSong.title,
          artist: randomSong.artist,
          youtubeId: randomSong.youtubeId,
          duration: randomSong.duration,
        },
      };

      await kv.set(RADIO_STATE_KEY, newState);

      // ANUNCIA A NOVA MÚSICA PARA TODOS OS OUVINTES
      const channel = ably.channels.get("radio-controller");
      await channel.publish("new-song", newState);

      return NextResponse.json(newState);
    } else {
      return NextResponse.json(currentState);
    }
  } catch (error) {
    console.error("Erro na API da Rádio:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
