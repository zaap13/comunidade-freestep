'use client'

import { useState, useRef } from "react";
import YouTube, { type YouTubeProps, type YouTubePlayer } from 'react-youtube';
import { Music, Volume1, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioState } from "@/hooks/useRadio";

interface RadioPlayerProps {
  radioState: RadioState | null;
  isRadioOn: boolean;
  setIsRadioOn: (isOn: boolean) => void;
}

export default function RadioPlayer({ radioState, isRadioOn, setIsRadioOn }: RadioPlayerProps) {
  const [volume, setVolume] = useState(50);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const lastVolumeRef = useRef(50);

  const handleSkipSong = async (brokenSongId?: string) => {
    try {
      await fetch('/api/radio/skip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brokenSongId }),
      });
    } catch (error) {
      console.log(error)
    }
  };

  const onReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
    const player = event.target;
    if (radioState) {
      const elapsedTime = (Date.now() - radioState.startTime) / 1000;
      player.unMute();
      player.setVolume(volume);
      if (elapsedTime > 0 && elapsedTime < radioState.song.duration) {
        player.seekTo(elapsedTime, true);
      }
      player.playVideo();
    }
  };

  const onError: YouTubeProps['onError'] = (event) => {
    const errorCode = event.data;
    const permanentErrorCodes = [100, 101, 150];
    if (radioState?.song.id && permanentErrorCodes.includes(errorCode)) {
      setPlayerError('Vídeo indisponível. Pulando...');
      handleSkipSong(radioState.song.id);
    } else {
      setPlayerError(`Erro no player. Pulando...`);
      handleSkipSong();
    }
  };

  const onStateChange: YouTubeProps['onStateChange'] = (event) => {
    if (event.data === 0) { // Ended
      handleSkipSong();
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    playerRef.current?.setVolume(newVolume);
  };

  const toggleMute = () => {
    if (volume > 0) {
      lastVolumeRef.current = volume;
      handleVolumeChange([0]);
    } else {
      handleVolumeChange([lastVolumeRef.current]);
    }
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;
  const opts: YouTubeProps['opts'] = {
    height: '0', width: '0',
    playerVars: { autoplay: 1, controls: 0, origin: typeof window !== 'undefined' ? window.location.origin : '', },
  };

  if (!radioState) {
    return <div className="text-muted-foreground animate-pulse">Sintonizando...</div>;
  }

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-4 -mb-10">
      {isRadioOn && (
        <div className="opacity-0 h-0 w-0">
          <YouTube
            key={radioState.song.id}
            videoId={radioState.song.youtubeId}
            opts={opts}
            onReady={onReady}
            onStateChange={onStateChange}
            onError={onError}
          />
        </div>
      )}
      {!isRadioOn ? (
        <Button size="lg" onClick={() => setIsRadioOn(true)} variant="secondary" className="h-20 w-48 shadow-lg shadow-secondary/30">
          <Music className="mr-2 h-6 w-6" />
          Ligar Rádio
        </Button>
      ) : playerError ? (
        <div className="text-destructive font-semibold">{playerError}</div>
      ) : (
        <div className="text-center w-full">
          <h3 className="text-lg font-semibold text-primary animate-pulse">AO VIVO</h3>
          <p className="text-2xl font-bold truncate">{radioState.song.title}</p>
          <p className="text-md text-muted-foreground">{radioState.song.artist}</p>
          <div className="flex items-center gap-2 mt-4 w-full px-4">
            <Button onClick={toggleMute} variant="ghost" size="icon" className="text-muted-foreground">
              <VolumeIcon className="h-5 w-5" />
            </Button>
            <Slider value={[volume]} onValueChange={handleVolumeChange} max={100} step={1} />
          </div>
        </div>
      )}
    </div>
  );
}