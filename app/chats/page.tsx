import { getCurrentUserId } from "@/lib/getCurrentUser";
import Image from "next/image";
import Link from "next/link";
import { getMessageRooms } from "./actions";

interface Chat {
  id: string;
  username: string;
  image: string;
  lastMessage: string;
}

interface ChatListProps {
  chats: Chat[];
}

export default async function ChatList() {
  const session = await getCurrentUserId();
  const chatList = await getMessageRooms(session!.id);
  console.log(chatList[0].messages);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">채팅</h2>
      </div>
      <div className="overflow-y-auto">
        {chatList.map((chat) => (
          <Link href={`/chats/${chat.id}`} key={chat.id}>
            <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
              <Image
                src={chat.users[1].image || "/img/default.jpg"}
                alt={chat.users[1].name}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="ml-3">
                <p className="font-semibold">{chat.users[1].name}</p>
                <p className="text-sm text-gray-500">
                  {chat.messages[0].payload}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
