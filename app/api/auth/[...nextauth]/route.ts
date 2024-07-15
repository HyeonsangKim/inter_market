import { db } from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { editProfile2 } from "@/app/(tabs)/profile/edit/action";

const prisma = new PrismaClient();
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const findUser = await db.user.findUnique({
          where: {
            email: credentials!.email,
          },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            image: true,
            created_at: true,
          },
        });

        const ok = await bcrypt.compare(
          credentials!.password,
          findUser!.password ?? ""
        );
        if (ok) {
          const user = {
            id: findUser?.id,
            name: findUser?.name,
            image: findUser?.image,
            email: findUser?.email,
          };
          return user;
        } else {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session !== null) {
        const data = {
          image: session.image as any,
          name: session.name as string,
          email: session.email as string,
        };
        // editProfile2(data);
        token.name = session.name;
        token.image = session.image;
      }
      return { ...token, ...user };
    },
    async session({ session, token, trigger }) {
      session.user = token;
      console.log(session);

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
