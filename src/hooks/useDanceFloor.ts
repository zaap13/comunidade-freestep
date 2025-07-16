'use client'

import { useEffect, useState } from 'react'
import Ably from 'ably'
import { useSession } from 'next-auth/react'
import type { PresenceMessage } from 'ably'

export interface UserInfo {
  name: string | null;
  image: string | null;
  nick: string | null;
}

export interface Member extends PresenceMessage {
  data: UserInfo;
}

export function useDanceFloor() {
  const { data: session, status } = useSession();
  const [onlineUsers, setOnlineUsers] = useState<Member[]>([]);

  useEffect(() => {
    // Só executa quando a sessão estiver definida (logado ou deslogado)
    if (status === 'loading') return;

    const ablyClient = new Ably.Realtime({ authUrl: '/api/ably/auth' });

    ablyClient.connection.on('connected', async () => {
      const channel = ablyClient.channels.get('dance-floor:presence');

      // Pega a lista inicial de membros
      const initialMembers = await channel.presence.get();
      setOnlineUsers(initialMembers as Member[]);
      
      // Se inscreve nos eventos de entrada e saída
      channel.presence.subscribe(['enter', 'leave'], (memberMessage) => {
        setOnlineUsers(prev => {
          if (memberMessage.action === 'leave') {
            // Remove o membro que saiu
            return prev.filter(m => m.clientId !== memberMessage.clientId);
          } else {
            // Adiciona o novo membro (prevenindo duplicatas)
            const others = prev.filter(m => m.clientId !== memberMessage.clientId);
            return [...others, memberMessage as Member];
          }
        });
      });

      // Entra no canal com os dados do usuário atual (logado ou anônimo)
      const userData: UserInfo = {
        name: session?.user?.name || `Anônimo`,
        image: session?.user?.image || null,
        nick: session?.user?.nick || null,
      };
      channel.presence.enter(userData);
    });

    return () => {
      ablyClient.close();
    };
  }, [status, session]);

  return { onlineUsers };
}