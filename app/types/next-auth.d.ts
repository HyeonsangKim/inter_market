// next-auth.d.ts
import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Add the `id` property to the JWT type
  }
}

declare module "next-auth" {
  interface Session {
    user?: {
      id: string; // Customize this according to your actual user model
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }
}
