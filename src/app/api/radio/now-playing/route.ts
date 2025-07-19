import { kv } from "@vercel/kv";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import Ably from "ably";

const RADIO_STATE_KEY = "radio:state";
const RADIO_PLAYLIST_KEY = "radio:playlist";

interface Song {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  duration: number;
}

interface RadioState {
  songId: string;
  startTime: number;
  song: Song;
}

const ably = new Ably.Rest(process.env.ABLY_API_KEY!);

export async function GET() {
  try {
    const now = Date.now();

    const currentState = await kv.get<RadioState>(RADIO_STATE_KEY);

    const songEndTime = currentState
      ? currentState.startTime + currentState.song.duration * 1000
      : 0;

    if (currentState && now < songEndTime) {
      // Ainda está tocando, retorna o estado atual
      return NextResponse.json(currentState);
    }

    // Se acabou a música ou não há música ainda
    let playlist = await kv.lrange<string>(RADIO_PLAYLIST_KEY, 0, -1);

    // Se a playlist está vazia, cria uma nova embaralhada
    if (!playlist || playlist.length === 0) {
      const approvedSongs = await prisma.music.findMany({
        where: { status: "approved" },
        select: { id: true },
      });

      if (approvedSongs.length === 0) {
        return NextResponse.json(
          { error: "Nenhuma música aprovada no banco de dados." },
          { status: 404 }
        );
      }

      const shuffled = shuffleArray(approvedSongs.map((s) => s.id));

      // Salva nova playlist no Redis
      await kv.del(RADIO_PLAYLIST_KEY);
      await kv.rpush(RADIO_PLAYLIST_KEY, ...shuffled);

      playlist = shuffled;
    }

    // Tira a próxima música da fila
    const nextSongId = await kv.lpop<string>(RADIO_PLAYLIST_KEY);

    if (!nextSongId) {
      return NextResponse.json(
        { error: "Falha ao recuperar próxima música da playlist." },
        { status: 500 }
      );
    }

    const song = await prisma.music.findUnique({
      where: { id: nextSongId },
    });

    if (!song) {
      return NextResponse.json(
        { error: "Música não encontrada no banco de dados." },
        { status: 404 }
      );
    }

    const newState: RadioState = {
      songId: song.id,
      startTime: now,
      song: {
        id: song.id,
        title: song.title,
        artist: song.artist,
        youtubeId: song.youtubeId,
        duration: song.duration,
      },
    };

    await kv.set(RADIO_STATE_KEY, newState);

    const channel = ably.channels.get("radio-controller");
    await channel.publish("new-song", newState);

    return NextResponse.json(newState);
  } catch (error) {
    console.error("Erro na API da Rádio:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
