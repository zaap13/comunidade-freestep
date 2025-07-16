'use client'

import React, { useState } from 'react';
import Image from 'next/image';

type AvatarProps = {
  src?: string | null;
  alt?: string | null;
  fallback: React.ReactNode;
  className?: string;
  size?: number;
};

export function Avatar({ src, alt, fallback, className, size = 32 }: AvatarProps) {
  const [hasError, setHasError] = useState(!src);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-full bg-muted ${className}`}
      style={{ width: size, height: size }}
    >
      {!hasError ? (
        <Image
          src={src!}
          alt={alt ?? ''}
          width={size}
          height={size}
          className="aspect-square object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="font-medium text-muted-foreground select-none">
          {fallback}
        </span>
      )}
    </div>
  );
}