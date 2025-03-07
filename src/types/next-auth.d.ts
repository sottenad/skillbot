import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      location?: string | null;
      businessUnit?: string | null;
      role?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    isAdmin: boolean;
    location?: string | null;
    businessUnit?: string | null;
    role?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isAdmin: boolean;
    location?: string | null;
    businessUnit?: string | null;
    role?: string | null;
  }
} 