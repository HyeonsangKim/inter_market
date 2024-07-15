import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { db } from "./db";

export async function getSession() {
  return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();
    console.log("sess " + session);

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
