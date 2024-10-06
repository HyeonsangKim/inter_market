"use server";

import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import { Message, ChatRoom, User } from "@prisma/client";

type ChatRoomWithUsersAndMessages = ChatRoom & {
  users: User[];
  messages: (Message & {
    sender: Pick<User, "id" | "name" | "image">;
    receiver: Pick<User, "id" | "name" | "image">;
  })[];
};

export async function saveMessage(
  payload: string,
  chatRoomId: string,
  receiverId: string
): Promise<{ id: number }> {
  const session = await getCurrentUserId();
  return await db.message.create({
    data: {
      payload,
      chatRoomId,
      senderId: session!.id!,
      receiverId,
      isRead: false,
    },
    select: { id: true },
  });
}

export async function getMessageRooms(
  currentId: string
): Promise<ChatRoomWithUsersAndMessages[]> {
  return await db.chatRoom.findMany({
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
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: {
      updated_at: "desc",
    },
  });
}

export async function markMessagesAsRead(
  chatRoomId: string,
  currentUserId: string
): Promise<void> {
  await db.message.updateMany({
    where: {
      chatRoomId: chatRoomId,
      receiverId: currentUserId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
}

export async function getUnreadMessagesCount(userId: string) {
  const unreadCount = await db.message.count({
    where: {
      receiverId: userId,
      isRead: false,
    },
  });
  return unreadCount;
}
