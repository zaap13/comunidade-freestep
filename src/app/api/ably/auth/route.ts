import { auth } from "@/../auth";
import Ably from "ably";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: Request) {
  const session = await auth();

  // Se o usuário está logado, usamos seu ID.
  // Se não, geramos um ID de convidado único e temporário.
  const clientId = session?.user?.id || uuidv4();
  
  const ably = new Ably.Rest(process.env.ABLY_API_KEY!);
  
  const tokenRequestData = await ably.auth.createTokenRequest({
    clientId: clientId,
  });
  
  return NextResponse.json(tokenRequestData);
}