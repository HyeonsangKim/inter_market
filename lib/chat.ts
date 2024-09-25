"use server";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "./getCurrentUser";
import { db } from "./db";

export const createChatRoom = async (targetId: string) => {
  const session = await getCurrentUserId();
  const roomExist = await db.chatRoom.findFirst({
    where: {
      AND: [
        { users: { some: { id: targetId } } },
        { users: { some: { id: session!.id } } },
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
      },
      select: {
        id: true,
      },
    });
    redirect(`/chats/${room.id}`);
  }
};
