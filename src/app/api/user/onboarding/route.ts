import { auth } from "@/../auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nick } = body;

    if (!nick || nick.length < 3) {
      return NextResponse.json(
        { message: "Nick inválido. Precisa ter pelo menos 3 caracteres." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { nick },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Este nick já está em uso. Tente outro." },
        { status: 409 }
      );
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { nick },
    });

    return NextResponse.json(
      { message: "Perfil atualizado com sucesso!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
