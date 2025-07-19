import { NextResponse } from 'next/server';
import { auth } from '@/../auth';
import prisma from '@/lib/prisma';
import { kv } from '@vercel/kv';
import Ably from 'ably';

const RADIO_STATE_KEY = 'radio:state';
const ably = new Ably.Rest(process.env.ABLY_API_KEY!);

export async function POST(request: Request) {
  console.log('--- Rota /api/radio/skip acionada ---');
  const session = await auth();
  if (!session?.user?.id) {
    console.error('SKIPPED: Usuário não autorizado.');
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    const brokenSongId = body?.brokenSongId;
    console.log('ID da música quebrada recebido:', brokenSongId);

    if (brokenSongId) {
      try {
        console.log(`Tentando marcar a música ${brokenSongId} como "broken"...`);
        await prisma.music.update({
          where: { id: brokenSongId },
          data: { status: 'broken' },
        });
        console.log(`SUCESSO: Música ${brokenSongId} marcada como "broken".`);
      } catch (updateError) {
        console.error(`FALHA ao atualizar a música ${brokenSongId}:`, updateError);
      }
    }

    console.log('Procurando por uma nova música aprovada...');
    const songs = await prisma.music.findMany({
      where: {
        status: 'approved',
        id: { not: brokenSongId || undefined },
      },
    });
    console.log(`${songs.length} músicas encontradas.`);

    if (songs.length === 0) {
      console.log('Nenhuma música disponível. Resetando a rádio.');
      await kv.del(RADIO_STATE_KEY);
      const channel = ably.channels.get('radio-controller');
      await channel.publish('new-song', null);
      return NextResponse.json({ message: 'Playlist vazia, rádio resetada.' });
    }

    const newSong = songs[Math.floor(Math.random() * songs.length)];
    console.log(`Nova música selecionada: ${newSong.title}`);
    const now = Date.now();

    const newState = {
      songId: newSong.id,
      startTime: now,
      song: newSong,
    };

    await kv.set(RADIO_STATE_KEY, newState);
    
    const channel = ably.channels.get('radio-controller');
    await channel.publish('new-song', newState);
    console.log('--- Fim da rota /api/radio/skip ---');
    return NextResponse.json(newState);

  } catch (error) {
    console.error('Erro catastrófico na rota de skip:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}