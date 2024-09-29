import ChatMessagesList from "@/components/chat-messages-list";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { getMessageRooms } from "../actions";

async function getRoom(id: string) {
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

async function getMessages(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          image: true,
          name: true,
        },
      },
    },
  });
  return messages;
}

async function getUserProfile(id: string) {
  const user = await db.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  return user;
}

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;
export type InitialChatList = Prisma.PromiseReturnType<typeof getRoom>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  if (!room) {
    return notFound();
  }

  const initialMessages = await getMessages(params.id);
  const session = await getCurrentUserId();
  const chatList = await getMessageRooms(session!.id);

  const user = await getUserProfile(room!.users[0].id);
  if (!user) return notFound();

  return (
    <ChatMessagesList
      chatRoomId={params.id}
      user={user}
      username={room.users[1].name}
      image={room.users[1].image}
      chatList={chatList}
      initialMessages={initialMessages}
    />
  );
}
