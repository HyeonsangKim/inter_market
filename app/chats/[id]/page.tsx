import ChatMessagesList from "@/components/ChatMessagesList";
import { db } from "@/lib/db";
import type { ChatRoom, Message, User } from "@prisma/client";
import { notFound } from "next/navigation";
import { getMessageRooms, markMessagesAsRead } from "../actions";
import { getCurrentUser } from "@/app/utils/supabase/get-user";

type RoomWithUsers = ChatRoom & {
  users: Pick<User, "id" | "name" | "image">[];
  messages?: Message[];
};

interface MessageWithUser {
  id: number;
  payload: string;
  created_at: Date;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  sender: {
    name: string | null;
    image: string | null;
  };
  receiver: {
    name: string | null;
    image: string | null;
  };
}

async function getRoom(id: string): Promise<RoomWithUsers | null> {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
  if (room) {
    const session = await getCurrentUser();
    const canSee = Boolean(room.users.find((user) => user.id === session!.id!));

    if (!canSee) {
      return null;
    }
  }
  return room;
}

async function getMessages(chatRoomId: string): Promise<MessageWithUser[]> {
  return await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      senderId: true,
      receiverId: true,
      isRead: true,
      sender: {
        select: {
          image: true,
          name: true,
        },
      },
      receiver: {
        select: {
          image: true,
          name: true,
        },
      },
    },
    orderBy: {
      created_at: "asc",
    },
  });
}

export type InitialChatMessages = Awaited<ReturnType<typeof getMessages>>;
export type InitialChatList = Awaited<ReturnType<typeof getRoom>>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  if (!room) {
    return notFound();
  }

  const initialMessages = await getMessages(params.id);
  const session = await getCurrentUser();
  let chatList = await getMessageRooms(session!.id);
  chatList = chatList.map((chat) => {
    const sortedMessages = chat.messages.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const unreadMessages = sortedMessages.filter(
      (msg) => msg.receiverId === session!.id && !msg.isRead
    );

    return {
      ...chat,
      messages: sortedMessages,
      unreadCount: unreadMessages.length,
    };
  });
  const currentUser = room.users.find((user) => user.id === session!.id)!;
  const otherUser = room.users.find((user) => user.id !== session!.id)!;

  await markMessagesAsRead(params.id, currentUser.id);

  return (
    <ChatMessagesList
      chatRoomId={params.id}
      currentUser={currentUser}
      otherUser={otherUser}
      chatList={chatList}
      initialMessages={initialMessages}
    />
  );
}
