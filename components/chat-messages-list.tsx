"use client";
import { InitialChatMessages } from "@/app/chats/[id]/page";
import { saveMessage } from "@/app/chats/actions";
import { formatToTimeAgo } from "@/app/utils/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import { ArrowUpCircle, Info, Phone, Video } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpa3JhenBjYW52eWN4dmxka3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1Mjk0MDksImV4cCI6MjAyOTEwNTQwOX0.c-8n5fYNkJN0AFLJQbvJbHlM-qPtACJbvWzvY7W8kLY";
const SUPABASE_URL = "https://tikrazpcanvycxvldksm.supabase.co";
interface ChatMessagesListProps {
  initialMessages: InitialChatMessages;
  userId: string;
  chatRoomId: string;
  username: string;
  avatar: string;
}

export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  username,
  avatar,
}: ChatMessagesListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  // const channel = useRef<RealtimeChannel>();
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };
  // const onSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   setMessages((prevMsgs) => [
  //     ...prevMsgs,
  //     {
  //       id: Date.now(),
  //       payload: message,
  //       created_at: new Date(),
  //       userId,
  //       user: {
  //         username: "string",
  //         avatar: "xxx",
  //       },
  //     },
  //   ]);
  //   channel.current?.send({
  //     type: "broadcast",
  //     event: "message",
  //     payload: {
  //       id: Date.now(),
  //       payload: message,
  //       created_at: new Date(),
  //       userId,
  //       user: {
  //         username,
  //         avatar,
  //       },
  //     },
  //   });
  //   await saveMessage(message, chatRoomId);
  //   setMessage("");
  // };
  // useEffect(() => {
  //   const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
  //   channel.current = client.channel(`room-${chatRoomId}`);
  //   channel.current
  //     .on("broadcast", { event: "message" }, (payload) => {
  //       setMessages((prev) => [...prev, payload.payload]);
  //     })
  //     .subscribe();
  //   return () => {
  //     channel.current?.unsubscribe();
  //   };
  // }, [chatRoomId]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      {/* 채팅 목록 */}
      <div className="w-80 border-r border-gray-200 bg-white flex-shrink-0 overflow-y-auto hidden md:flex md:flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">채팅</h2>
        </div>
        <div className="overflow-y-auto flex-grow">
          {/* 채팅 목록 아이템들 */}
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
            >
              <Image
                src={`/user${item}.jpg`}
                alt={`User ${item}`}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="ml-3">
                <p className="font-semibold">사용자 {item}</p>
                <p className="text-sm text-gray-500">최근 메시지...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 채팅 인터페이스 */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* 채팅 상대 정보 */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/user2.jpg"
              alt="채팅 상대"
              width={40}
              height={40}
              className="rounded-full"
            />
            <h2 className="text-xl font-semibold ml-3">채팅 상대 이름</h2>
          </div>
          <div className="flex space-x-4">
            <Phone className="w-6 h-6 text-gray-600 cursor-pointer" />
            <Video className="w-6 h-6 text-gray-600 cursor-pointer" />
            <Info className="w-6 h-6 text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* 메시지 영역 (스크롤 가능) */}
        <div className="flex-grow overflow-y-auto bg-gray-100">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.userId === userId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end space-x-2 max-w-[70%] ${
                    message.userId === userId
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {message.userId !== userId && (
                    <Image
                      src={message.user.image || "/default.png"}
                      alt={message.user.name}
                      width={32}
                      height={32}
                      className="rounded-full self-end"
                    />
                  )}
                  <div
                    className={`flex flex-col ${
                      message.userId === userId ? "items-end" : "items-start"
                    }`}
                  >
                    <span
                      className={`px-4 py-2 rounded-3xl ${
                        message.userId === userId
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {message.payload}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {formatToTimeAgo(message.created_at.toString())}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 입력 영역 (항상 표시) */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form className="flex items-center">
            <input
              type="text"
              placeholder="메시지 보내기..."
              value={message}
              onChange={onChange}
              className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="ml-2 text-blue-500 hover:text-blue-600 focus:outline-none"
            >
              <ArrowUpCircle className="w-8 h-8" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
