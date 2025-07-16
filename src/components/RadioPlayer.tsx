'use client'

import { useState, useEffect, useRef } from "react";
import { Music } from "lucide-react";
import { Button } from "./ui/button";

interface RadioState {
  song: {
    title: string;
    artist: string;
    youtubeId: string;
    duration: number;
  };
  startTime: number;
}

export default function RadioPlayer() {
  const [radioState, setRadioState] = useState<RadioState | null>(null);
  const [isRadioOn, setIsRadioOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchCurrentSong = async () => {
      try {
        const response = await fetch('/api/radio/now-playing');
        const data = await response.json();
        setRadioState(data);
      } catch (error) {
        console.error("Erro ao buscar música:", error);
      }
    };
    fetchCurrentSong();
  }, []);

  const handlePlayRadio = () => {
    setIsRadioOn(true);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Erro ao dar play:", e));
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (isRadioOn && audio && radioState) {
      const elapsedTimeInSeconds = (Date.now() - radioState.startTime) / 1000;
      if (elapsedTimeInSeconds > 0 && elapsedTimeInSeconds < radioState.song.duration) {
        audio.currentTime = elapsedTimeInSeconds;
      }
      audio.play().catch(e => console.error("Erro ao dar play no sync:", e));
    }
  }, [isRadioOn, radioState]);

  const getSongUrl = (_id: string) => {
    return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  }

  const handleSongEnd = async () => {
    try {
      const response = await fetch('/api/radio/now-playing');
      const data = await response.json();
      setRadioState(data);
    } catch (error) {
      console.error("Erro ao buscar a próxima música:", error);
    }
  }

  if (!radioState) {
    return <div className="text-muted-foreground animate-pulse">Sintonizando...</div>;
  }

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-4">
      <audio 
        ref={audioRef} 
        src={getSongUrl(radioState.song.youtubeId)}
        onEnded={handleSongEnd}
        className="hidden"
        autoPlay={isRadioOn}
      />

      {!isRadioOn ? (
        <Button size="lg" onClick={handlePlayRadio} variant="secondary">
          <Music className="mr-2 h-6 w-6" />
          Ligar Rádio
        </Button>
      ) : (
        <div className="text-center">
          <h3 className="text-lg font-semibold text-primary animate-pulse">AO VIVO</h3>
          <p className="text-2xl font-bold">{radioState.song.title}</p>
          <p className="text-md text-muted-foreground">{radioState.song.artist}</p>
        </div>
      )}
    </div>
  );
}