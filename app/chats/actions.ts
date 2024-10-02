"use server";

import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import { getSession } from "@/lib/session";

export async function saveMessage(payload: string, chatRoomId: string) {
  const session = await getCurrentUserId();
  await db.message.create({
    data: {
      payload,
      chatRoomId,
      userId: session!.id!,
    },
    select: { id: true },
  });
}

export async function getMessageRooms(currentId: string) {
  const messageList = await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: currentId,
        },
      },
    },
    include: {
      users: true,
      messages: {
        orderBy: {
          created_at: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      updated_at: "desc",
    },
  });
  return messageList;
}
