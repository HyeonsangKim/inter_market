import ChatMessagesList from "@/components/chat-messages-list";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import { Message, ChatRoom, User } from "@prisma/client";
import { notFound } from "next/navigation";
import { getMessageRooms, markMessagesAsRead } from "../actions";

type RoomWithUsers = ChatRoom & {
  users: Pick<User, "id" | "name" | "image">[];
};

type MessageWithUser = Message & {
  sender: Pick<User, "image" | "name">;
  receiver: Pick<User, "image" | "name">;
};

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
    const session = await getCurrentUserId();
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
  const session = await getCurrentUserId();
  const chatList = await getMessageRooms(session!.id);

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
