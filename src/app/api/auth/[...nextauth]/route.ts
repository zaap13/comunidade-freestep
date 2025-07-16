import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters"
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. No primeiro login, o objeto `user` (vindo do banco) existe.
      // Adicionamos os dados dele ao token.
      if (user) {
        token.id = user.id
        token.nick = user.nick // Neste ponto, o nick será nulo
        token.role = user.role
        token.isVerified = user.isVerified
      }
  
      // 2. Quando chamamos update() no frontend, o `trigger` é "update"
      // e a `session` contém os dados que passamos (ex: { nick: 'novoNick' }).
      if (trigger === "update" && session?.nick) {
        token.nick = session.nick
      }
  
      return token
    },

    async session({ session, token }) {
      // 3. Em toda chamada de `useSession`, passamos os dados atualizados do token para a sessão do cliente.
      if (token) {
        session.user.id = token.id as string
        session.user.nick = token.nick as string | null
        session.user.role = token.role as string
        session.user.isVerified = token.isVerified as boolean
      }
      return session
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
