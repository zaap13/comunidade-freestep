'use client'

import { useState, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { Button } from "./ui/Button";

// Dados de exemplo, depois virão do nosso sistema
const playlist = [
  {
    title: "Primeira Música",
    artist: "DJ FreeStep",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // URL de exemplo
  }
];

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = playlist[currentSongIndex];

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-4">
      {/* Elemento de áudio, fica escondido */}
      <audio ref={audioRef} src={currentSong.url} />

      {/* Informações da Música */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-primary">{currentSong.title}</h3>
        <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
      </div>

      {/* Controles do Player */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" disabled>
          <SkipBack className="h-6 w-6" />
        </Button>
        
        <Button variant="outline" size="lg" className="h-16 w-16 rounded-full" onClick={togglePlayPause}>
          {isPlaying 
            ? <Pause className="h-8 w-8" /> 
            : <Play className="h-8 w-8" />
          }
        </Button>

        <Button variant="ghost" size="icon" disabled>
          <SkipForward className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}