'use client'

import { useEffect, useState } from 'react'
import ablyClient from '@/lib/ably' // 1. Importa nosso cliente central
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
    if (status === 'loading') {
      return;
    }
    
    // 2. Usa o cliente importado diretamente
    const channel = ablyClient.channels.get('dance-floor:presence');

    const onPresenceUpdate = async () => {
      const members = await channel.presence.get();
      setOnlineUsers(members as Member[]);
    };

    const enterChannel = () => {
      const userData: UserInfo = {
        name: session?.user?.name || `Anônimo`,
        image: session?.user?.image || null,
        nick: session?.user?.nick || `Anônimo#${Math.random().toString(36).substring(2, 6)}`,
      };
      channel.presence.enter(userData);
    };

    ablyClient.connection.on('connected', () => {
      enterChannel();
      channel.presence.subscribe(['present', 'enter', 'leave'], onPresenceUpdate);
      onPresenceUpdate();
    });

    // 3. A limpeza agora é mais simples, pois não fechamos a conexão global aqui
    return () => {
      channel.presence.unsubscribe();
    };
  }, [status, session]);

  return { onlineUsers };
}