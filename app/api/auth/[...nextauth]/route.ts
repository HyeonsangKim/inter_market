import { db } from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { authOptions } from "@/app/utils/authOptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
