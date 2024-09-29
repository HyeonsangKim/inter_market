"use client";
import { InitialChatList, InitialChatMessages } from "@/app/chats/[id]/page";
import { formatToTimeAgo } from "@/app/utils/utils";
import { ArrowUpCircle, Info, Phone, Video } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import { saveMessage } from "@/app/chats/actions";

interface ChatMessagesListProps {
  initialMessages: InitialChatMessages;
  user: any;
  chatRoomId: string;
  username: string;
  chatList: Array<{
    id: string;
    users: Array<{ id: string; name: string; image: string }>;
    messages: Array<{ id: string; payload: string; created_at: string }>;
  }>;
  image: string;
}

export default function ChatMessagesList({
  chatRoomId,
  user,
  username,
  image,
  chatList,
  initialMessages,
}: ChatMessagesListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const channel = useRef<RealtimeChannel>();
  console.log(user.id);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessages((prevMsgs) => [
      ...prevMsgs,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId: user.id,
        user: {
          username: user.name,
          image: user.image,
        },
      },
    ]);
    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId: user.id,
        user: {
          username: user.name,
          image: user.image,
        },
      },
    });
    await saveMessage(message, chatRoomId);
    setMessage("");
  };
  useEffect(() => {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY
    );
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload]);
      })
      .subscribe();
    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      {/* 채팅 목록 */}
      <div className="w-80 border-r border-gray-200 bg-white flex-shrink-0 overflow-y-auto hidden md:flex md:flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">채팅</h2>
        </div>
        <div className="overflow-y-auto flex-grow">
          {/* 채팅 목록 아이템들 */}
          {chatList.map((item) => (
            <div
              key={item.id}
              className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
            >
              <Image
                src={item.users[1]?.image || "/img/default.jpg"}
                alt={item.users[1]?.name || "User"}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="ml-3">
                <p className="font-semibold">{item.users[1]?.name || "User"}</p>
                <p className="text-sm text-gray-500">
                  {item.messages[item.messages.length - 1]?.payload ||
                    "No messages yet"}
                </p>
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
              src={`${image}` || "/img/default.jpg"}
              alt={`${image}`}
              width={40}
              height={40}
              className="rounded-full"
            />
            <h2 className="text-xl font-semibold ml-3">{username}</h2>
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
                  message.userId === user.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end space-x-2 max-w-[70%] ${
                    message.userId === user.id
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {message.userId !== user.id && (
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
                      message.userId === user.id ? "items-end" : "items-start"
                    }`}
                  >
                    <span
                      className={`px-4 py-2 rounded-3xl ${
                        message.userId === user.id
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
          <form className="flex items-center" onSubmit={onSubmit}>
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
