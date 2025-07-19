// Arquivo: src/types/globals.d.ts
import type Ably from 'ably';

declare global {
  var ablyClient: Ably.Realtime | undefined;
}