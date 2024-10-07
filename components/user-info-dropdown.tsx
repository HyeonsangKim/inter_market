"use client";
import { createChatRoom } from "@/lib/chat";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface User {
  id: string;
  image: string | null;
  name: string | null;
}

interface UserInfoDropdownType {
  user: User;
}

export function UserInfoDropdown({ user }: UserInfoDropdownType) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
      >
        <Image
          src={user.image || "/default-avatar.png"}
          alt={"profile Image"}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <span className="font-medium">{user.name}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <Link
            href={`/profile/${user.id}`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile
          </Link>
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => createChatRoom(user.id)}
          >
            Chat
          </button>
        </div>
      )}
    </div>
  );
}
