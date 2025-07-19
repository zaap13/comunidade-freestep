'use client'

import { useState, useEffect } from "react";
import ablyClient from "@/lib/ably";

export interface RadioState {
  song: {
    id: string;
    title: string;
    artist: string;
    youtubeId: string;
    duration: number;
  };
  startTime: number;
}

export function useRadio() {
  const [radioState, setRadioState] = useState<RadioState | null>(null);

  useEffect(() => {
    const channel = ablyClient.channels.get("radio-controller");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onNewSong = (message: any) => {
      if (message.data) {
        setRadioState(message.data);
      }
    };

    const fetchInitialState = async () => {
      try {
        const response = await fetch("/api/radio/now-playing");
        if (!response.ok) return;
        const data = await response.json();
        if (data.error) return;
        setRadioState(data);
      } catch (error) {
        console.error("Erro ao buscar estado inicial da rádio:", error);
      }
    };

    fetchInitialState();
    channel.subscribe("new-song", onNewSong);

    return () => {
      channel.unsubscribe("new-song", onNewSong);
    };
  }, []);

  return { radioState };
}