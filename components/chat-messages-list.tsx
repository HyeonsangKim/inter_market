"use client";
import { InitialChatList, InitialChatMessages } from "@/app/chats/[id]/page";
import { formatToTimeAgo } from "@/app/utils/utils";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  ArrowUpCircle,
  Info,
  Phone,
  Video,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import { markMessagesAsRead, saveMessage } from "@/app/chats/actions";
import Link from "next/link";

interface User {
  id: string;
  name: string | null;
  image: string | null;
}

interface Message {
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

interface ChatMessagesListProps {
  initialMessages: InitialChatMessages;
  currentUser: User;
  otherUser: User;
  chatRoomId: string;
  chatList: InitialChatList[];
}

export default function ChatMessagesList({
  chatRoomId,
  currentUser,
  otherUser,
  chatList,
  initialMessages,
}: ChatMessagesListProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [message, setMessage] = useState("");
  const [showMobileList, setShowMobileList] = useState(false);
  const channel = useRef<RealtimeChannel>();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newMessage = {
      id: Date.now(),
      payload: message,
      created_at: new Date(),
      senderId: currentUser.id,
      receiverId: otherUser.id,
      isRead: false,
      sender: {
        name: currentUser.name,
        image: currentUser.image,
      },
      receiver: {
        name: otherUser.name,
        image: otherUser.image,
      },
    };
    setMessages((prevMsgs) => [...prevMsgs, newMessage]);
    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: newMessage,
    });
    await saveMessage(message, chatRoomId, otherUser.id);
    setMessage("");
  };

  useEffect(() => {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY as string
    );
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload]);
        if (payload.payload.receiverId === currentUser.id) {
          markMessagesAsRead(chatRoomId, currentUser.id);
        }
      })
      .subscribe();
    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      {/* 모바일 채팅 목록 오버레이 */}
      {showMobileList && (
        <div className="fixed inset-0 bg-white z-50 md:hidden flex flex-col h-[calc(100vh-64px)]">
          {" "}
          {/* 모바일 네비게이션 높이(64px) 만큼 빼기 */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold">채팅 목록</h2>
            <button
              onClick={() => setShowMobileList(false)}
              className="text-gray-600"
            >
              <ArrowRightCircle className="w-6 h-6" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 pb-16">
            {" "}
            {/* 바텀 네비게이션 영역만큼 패딩 추가 */}
            {chatList.map((item) => (
              <Link
                key={item?.id}
                href={`/chats/${item?.id}`}
                onClick={() => setShowMobileList(false)}
              >
                <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200">
                    <Image
                      src={item?.users[0].image || "/default-avatar.png"}
                      alt={`${item?.users[0].name}'s profile image`}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">
                      {item?.users[1]?.name || "User"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item?.messages?.[0]?.payload || "No messages yet"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {/* 데스크탑 채팅 목록 */}
      <div className="w-80 border-r border-gray-200 bg-white flex-shrink-0 overflow-y-auto hidden md:flex md:flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">채팅</h2>
        </div>
        <div className="overflow-y-auto flex-grow">
          {chatList.map((item) => (
            <Link key={item?.id} href={`/chats/${item?.id}`}>
              <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200">
                  <Image
                    src={item?.users[0].image || "/default-avatar.png"}
                    alt={`${item?.users[0].name}'s profile image`}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="font-semibold">
                    {item?.users[1]?.name || "User"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item?.messages?.[0]?.payload || "No messages yet"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 채팅 인터페이스 */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* 채팅 상대 정보 */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setShowMobileList(true)}
              className="mr-3 md:hidden"
            >
              <ArrowLeftCircle className="w-6 h-6 text-gray-600" />
            </button>
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200">
              <Image
                src={otherUser.image || "/default-avatar.png"}
                alt={`${otherUser.name}'s profile image`}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold ml-3">{otherUser.name}</h2>
          </div>
          <div className="flex space-x-4">
            <Phone className="w-6 h-6 text-gray-600 cursor-pointer" />
            <Video className="w-6 h-6 text-gray-600 cursor-pointer" />
            <Info className="w-6 h-6 text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-grow overflow-y-auto bg-gray-100">
          <div className="p-4 space-y-4">
            {messages.map((message, idx) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === currentUser.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end space-x-2 max-w-[70%] ${
                    message.senderId === currentUser.id
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {message.senderId !== currentUser.id && (
                    <Image
                      src={message.sender.image || "/img/default.jpg"}
                      alt={message.sender.name || "no"}
                      width={32}
                      height={32}
                      className="rounded-full self-end"
                    />
                  )}
                  <div
                    className={`flex flex-col ${
                      message.senderId === currentUser.id
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <span
                      className={`px-4 py-2 rounded-3xl ${
                        message.senderId === currentUser.id
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {message.payload}
                    </span>
                    {idx === messages.length - 1 && (
                      <span className="text-xs text-gray-500 mt-1">
                        {formatToTimeAgo(message.created_at.toString())}
                        {message.senderId === currentUser.id &&
                          (message.isRead ? " (읽음)" : " (안 읽음)")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 입력 영역 */}
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
