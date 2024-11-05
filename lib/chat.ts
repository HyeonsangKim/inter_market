"use server";
import { redirect } from "next/navigation";
import { db } from "./db";
import { getCurrentUser } from "@/app/utils/supabase/get-user";

export const createChatRoom = async (targetId: string) => {
  const session = await getCurrentUser();
  if (!session) {
    redirect("/login");
  }
  const roomExist = await db.chatRoom.findFirst({
    where: {
      AND: [
        { users: { some: { id: targetId } } },
        { users: { some: { id: session!.id } } },
        { NOT: { hiddenBy: { has: session!.id } } },
      ],
    },
    select: { id: true },
  });
  if (roomExist) {
    redirect(`/chats/${roomExist.id}`);
  } else {
    const room = await db.chatRoom.create({
      data: {
        users: {
          connect: [
            {
              id: targetId,
            },
            {
              id: session!.id,
            },
          ],
        },
        hiddenBy: [],
      },
      select: {
        id: true,
      },
    });
    redirect(`/chats/${room.id}`);
  }
};
