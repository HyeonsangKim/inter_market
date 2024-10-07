import { getCurrentUserId } from "@/lib/getCurrentUser";
import Image from "next/image";
import Link from "next/link";
import { getMessageRooms } from "./actions";
import { ChatRoom, Message, User } from "@prisma/client";

type ChatRoomWithUsersAndMessages = ChatRoom & {
  users: User[];
  messages: (Message & {
    sender: Pick<User, "id" | "name" | "image">;
    receiver: Pick<User, "id" | "name" | "image">;
  })[];
};

export default async function ChatList() {
  const session = await getCurrentUserId();
  const chatList: ChatRoomWithUsersAndMessages[] = await getMessageRooms(
    session!.id
  );

  return (
    <div className="w-full max-w-2xl mx-auto bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">채팅</h2>
      </div>
      <div className="overflow-y-auto">
        {chatList.map((chat) => {
          const otherUser = chat.users.find((user) => user.id !== session!.id)!;
          const lastMessage = chat.messages[0];
          const unreadCount = chat.messages.filter(
            (msg) => msg.receiverId === session!.id && !msg.isRead
          ).length;

          return (
            <Link href={`/chats/${chat.id}`} key={chat.id}>
              <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
                <Image
                  src={otherUser.image || "/img/default.jpg"}
                  alt={otherUser.name || "no"}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="ml-3 flex-grow">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{otherUser.name}</p>
                    {unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {lastMessage ? (
                      <>{lastMessage.payload}</>
                    ) : (
                      "No messages yet"
                    )}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
