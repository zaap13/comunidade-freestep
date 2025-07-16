'use client'

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useDanceFloor, type Member } from '@/hooks/useDanceFloor';

function DancerAvatar({ member }: { member: Member }) {
  const randomStyles = useMemo(() => ({
    left: `${Math.floor(Math.random() * 90) + 5}%`,
    bottom: '10%',
    animationDelay: `${Math.random() * -2}s`,
    animationDuration: `${Math.random() * 2 + 1.5}s`,
  }), []);

  const displayName = member.data.nick || member.data.name || 'Dancer';
  const displayImage = member.data.image;
  const fallbackLetter = displayName.charAt(0).toUpperCase();

  return (
    <div 
      className="absolute transition-opacity duration-500"
      style={randomStyles}
      title={displayName}
    >
      <div className="w-8 h-8 rounded-full animate-bounce flex items-center justify-center bg-primary">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={displayName}
            width={32}
            height={32}
            className="w-full h-full rounded-full object-cover" 
          />
        ) : (
          <span className="text-lg font-bold text-primary-foreground">
            {fallbackLetter}
          </span>
        )}
      </div>
    </div>
  );
}

export default function DanceFloor() {
  const { onlineUsers } = useDanceFloor();

  return (
    <div className="relative w-full h-full">
      <h2 className="text-2xl font-bold text-secondary">Dance Floor ({onlineUsers.length})</h2>
      <p className="text-muted-foreground">
        {onlineUsers.length > 0 ? `${onlineUsers.length} dancer(s) online now!` : "The dance floor is empty... Call your friends!"}
      </p>

      {onlineUsers.map((member) => (
        <DancerAvatar key={member.clientId} member={member} />
      ))}
    </div>
  );
}