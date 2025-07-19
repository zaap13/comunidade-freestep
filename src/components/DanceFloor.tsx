'use client'

import React, { useMemo } from 'react';
import Image from 'next/image';
import YouTube, { type YouTubeProps } from 'react-youtube';
import { useDanceFloor, type Member } from '@/hooks/useDanceFloor';
import { Disc3 } from 'lucide-react';
import { RadioState } from '@/hooks/useRadio';

function DancerAvatar({ member }: { member: Member }) {
  const randomStyles = useMemo(() => ({
    left: `${Math.floor(Math.random() * 85) + 7.5}%`,
    bottom: `${Math.floor(Math.random() * 70) + 15}%`,
    transform: 'rotateX(-55deg)',
  }), []);
  const animationStyles = useMemo(() => ({
    animationDelay: `${Math.random() * -4}s`,
    animationDuration: `${Math.random() * 2 + 3}s`,
  }), []);
  const displayName = member.data.nick || member.data.name || 'Dancer';
  const displayImage = member.data.image;
  const fallbackLetter = displayName.charAt(0).toUpperCase();
  return (
    <div className="absolute group z-40" style={randomStyles} title={displayName}>
      <div className="w-10 h-10 rounded-full animate-bounce flex items-center justify-center bg-primary/50 border-2 border-primary shadow-lg shadow-primary/30" style={animationStyles}>
        {displayImage ? (<Image src={displayImage} alt={displayName} width={40} height={40} className="w-full h-full rounded-full object-cover" />) : (<span className="text-lg font-bold text-primary-foreground">{fallbackLetter}</span>)}
      </div>
      <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 bg-background/90 px-2 py-1 text-xs rounded-md text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
        {displayName}
      </div>
    </div>
  );
}

function SpeakerBox() {
  return (
    <div className="h-[60%] w-[10%] bg-slate-900 border-2 border-slate-700 rounded-lg flex flex-col items-center justify-center gap-4 p-4 shadow-inner self-end">
      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
        <div className="w-8 h-8 bg-secondary/50 rounded-full animate-pulse" style={{ animationDuration: '1.5s' }} />
      </div>
      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
        <div className="w-4 h-4 bg-slate-700 rounded-full" />
      </div>
    </div>
  )
}

function VideoScreen({ radioState, isRadioOn }: { radioState: RadioState | null; isRadioOn: boolean }) {
  const onReady: YouTubeProps['onReady'] = (event) => {
    const player = event.target;
    if (radioState) {
      const elapsedTime = (Date.now() - radioState.startTime) / 1000;
      if (elapsedTime > 0 && elapsedTime < radioState.song.duration) {
        player.seekTo(elapsedTime, true);
      }
      player.playVideo();
    }
  };

  const videoOpts: YouTubeProps['opts'] = {
    width: '100%',
    height: '100%',
    playerVars: { autoplay: 1, controls: 0, mute: 1, loop: 1, playlist: radioState?.song.youtubeId, showinfo: 0, rel: 0, iv_load_policy: 3 },
  };

  return (
    <div className="relative w-full h-full bg-black border-2 border-slate-700 rounded-lg flex items-center justify-center z-0 overflow-hidden">
      {isRadioOn && radioState ? (
        <>
          <YouTube
            key={radioState.song.id}
            videoId={radioState.song.youtubeId}
            className="absolute w-full h-auto min-w-full min-h-full top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2"
            opts={videoOpts}
            onReady={onReady}
          />
          <div className="absolute inset-0 w-full h-full z-10"></div>
        </>
      ) : (
        <p className="text-secondary/50 font-bold text-2xl animate-pulse">FREESTEP RÁDIO</p>
      )}
    </div>
  );
}

function DjBooth() {
  return (
    <div className="relative z-0 w-48 h-20 bg-slate-950 rounded-t-lg border-2 border-b-0 border-secondary flex items-center justify-center shadow-lg shadow-secondary/50 mt-[-60px]">
      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
        <Disc3 className="w-10 h-10 text-secondary animate-spin" style={{ animationDuration: '3s' }} />
      </div>
    </div>
  );
}

function Floor({ children }: { children: React.ReactNode }) {
  const floorStyle: React.CSSProperties = {
    background: `radial-gradient(ellipse 80% 100% at 50% 0%, oklch(var(--secondary) / 0.25), transparent 70%)`,
  };
  return (
    <div className="relative w-[75%] h-[85%] mt-[-180px]" style={{ perspective: '800px' }}>
      <div className="absolute w-full h-full rounded-lg bg-background/50 border border-primary/30 border-t-transparent" style={{ transform: 'rotateX(55deg)', transformStyle: 'preserve-3d', ...floorStyle }}>
        {children}
      </div>
    </div>
  );
}

export default function DanceFloor({ radioState, isRadioOn }: { radioState: RadioState | null; isRadioOn: boolean }) {
  const { onlineUsers } = useDanceFloor();
  return (
    <div className="relative w-full h-[70vh] min-h-[500px] flex flex-col items-center justify-start pt-4">
      <div className="w-[90%] h-[40%] flex items-center justify-center gap-4">
        <SpeakerBox />
        <div className="w-[40%] aspect-video">
          <VideoScreen radioState={radioState} isRadioOn={isRadioOn} />
        </div>
        <SpeakerBox />
      </div>
      <DjBooth />
      <Floor>
        {onlineUsers.map((member) => (
          <DancerAvatar key={member.clientId} member={member} />
        ))}
      </Floor>
    </div>
  );
}