import { getServerSession } from "next-auth";
import { db } from "./db";
import { authOptions } from "@/app/utils/authOptions";

export async function getSession() {
  return await getServerSession(authOptions);
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
