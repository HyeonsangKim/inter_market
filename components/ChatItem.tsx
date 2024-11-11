// components/ChatItem.tsx
"use client";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Message, User } from "@prisma/client";
import { hideChat } from "@/app/chats/actions";

interface ChatItemProps {
  chatId: string;
  currentUserId: string;
  otherUser: User;
  lastMessage?: Message;
  unreadCount: number;
}

export function ChatItem({
  chatId,
  currentUserId,
  otherUser,
  lastMessage,
  unreadCount,
}: ChatItemProps) {
  const handleHideChat = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link 클릭 방지
    if (confirm("이 채팅방을 삭제하시겠습니까?")) {
      const result = await hideChat(chatId, currentUserId);
      if (result.success) {
        window.location.reload();
      }
    }
  };
  return (
    <Link href={`/chats/${chatId}`}>
      <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer group">
        <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200">
          <Image
            src={otherUser.image || "/img/default.jpg"}
            alt={`${otherUser.name}'s profile image`}
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-3 flex-grow">
          <div className="flex justify-between items-center">
            <p className="font-semibold">{otherUser.name}</p>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
              <button
                onClick={handleHideChat}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded-full"
              >
                <Trash2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {lastMessage ? lastMessage.payload : "No messages yet"}
          </p>
        </div>
      </div>
    </Link>
  );
}
