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
        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
      >
        <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200">
          <Image
            src={user.image || "/default.jpg"}
            alt={`${user.name}'s profile image`}
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-medium text-gray-700 truncate max-w-[100px]">
          {user.name}
        </span>
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
