import Ably from 'ably';

const authUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/ably/auth`;

const ablyClient = globalThis.ablyClient ?? new Ably.Realtime({ authUrl });

if (process.env.NODE_ENV !== 'production') {
  globalThis.ablyClient = ablyClient;
}

export default ablyClient;