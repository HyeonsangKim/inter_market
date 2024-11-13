"use server";

import { db } from "@/lib/db";
import { Message, ChatRoom, User } from "@prisma/client";
import { getCurrentUser } from "../utils/supabase/get-user";
import { createClient } from "@supabase/supabase-js";

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
  const session = await getCurrentUser();

  return await db.$transaction(async (tx) => {
    // 1. 메시지 저장
    const message = await tx.message.create({
      data: {
        payload,
        chatRoomId,
        senderId: session!.id!,
        receiverId,
        isRead: false,
      },
      select: { id: true },
    });

    // 2. 채팅방 숨김 해제 및 시간 업데이트
    await tx.chatRoom.update({
      where: { id: chatRoomId },
      data: {
        hiddenBy: {
          set: [], // 모든 숨김 해제
        },
        updated_at: new Date(), // 채팅방 시간 업데이트
      },
    });

    return message;
  });
}

export async function getMessageRooms(
  currentId: string
): Promise<ChatRoomWithUsersAndMessages[]> {
  const rooms = await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: currentId,
        },
      },
      NOT: {
        hiddenBy: {
          has: currentId,
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

  // 현재 유저를 첫 번째로, 상대방을 두 번째로 정렬
  return rooms.map((room) => ({
    ...room,
    users: room.users.sort((a, b) => {
      if (a.id === currentId) return -1;
      if (b.id === currentId) return 1;
      return 0;
    }),
  }));
}

export async function markMessagesAsRead(
  chatRoomId: string,
  currentUserId: string
): Promise<void> {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY as string
  );
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
  const newUnreadCount = await db.message.count({
    where: {
      receiverId: currentUserId,
      isRead: false,
    },
  });
  const channel = client.channel("message-status");
  await channel.send({
    type: "broadcast",
    event: "read-messages",
    payload: {
      currentUserId,
      newCount: newUnreadCount,
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

export async function hideChat(chatRoomId: string, userId: string) {
  try {
    await db.chatRoom.update({
      where: { id: chatRoomId },
      data: {
        hiddenBy: {
          push: userId,
        },
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to hide chat:", error);
    return { success: false, error: "Failed to hide chat" };
  }
}
