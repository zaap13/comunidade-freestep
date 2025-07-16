import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    nick: string | null;
    role: string;
    isVerified: boolean;
  }
  interface Session {
    user: User & {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    nick: string | null;
    role: string;
    isVerified: boolean;
  }
}
