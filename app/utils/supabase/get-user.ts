"use server";
import { SessionUser } from "@/app/types/user";
import { db } from "@/lib/db";
import { cache } from "react";
import { createClient } from "./server";
import { redirect } from "next/navigation";

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  try {
    const supabase = createClient();

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Error fetching session:", sessionError);
      return null;
    }

    if (!session?.user) {
      return null;
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return null;
    }

    const enrichedUser: SessionUser = {
      ...user,
      email: session.user.email ?? null, // undefined 처리
      supabase_created_at: session.user.created_at,
      supabase_updated_at: session.user.updated_at,
    };

    return enrichedUser;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
});
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}
