import { getServerSession } from "next-auth";
import { db } from "./db";
import { authOptions } from "@/app/utils/authOptions";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUserId() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null; // 로그인하지 않은 경우
    }

    return session.user; // 로그인된 사용자 정보 반환
  } catch (error) {
    console.error("Error getting current user:", error);
    return null; // 에러 발생 시 null 반환
  }
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await db.user.findUnique({
      where: {
        email: session?.user?.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        created_at: true,
      },
    });

    if (!currentUser) {
      return null;
    }
    return currentUser;
  } catch (error) {
    return null;
  }
}
