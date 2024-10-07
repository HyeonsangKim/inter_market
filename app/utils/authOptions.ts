import { db } from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
type User = {
  id: string;
  name: string | null;
  image: string | null;
  email: string;
};
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
      async authorize(credentials, req): Promise<User | null> {
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
          const user: User = {
            id: findUser!.id!, // 여기서 !를 사용하여 undefined가 아님을 명시
            name: findUser!.name || null, // 이름이 없을 경우 null로 처리
            image: findUser!.image || null, // 이미지가 없을 경우 null로 처리
            email: findUser!.email!, // 이메일은 undefined가 아님을 명시
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
          id: session.id as string,
          image: session.image as any,
          name: session.name as string,
          email: session.email as string,
        };
        // editProfile2(data);
        token.id = session.id;
        token.name = session.name;
        token.image = session.image;
      }
      return { ...token, ...user };
    },
    async session({ session, token, trigger }) {
      session.user = token;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
