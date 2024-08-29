"use client";
import {
  HomeIcon as SolidHomeIcon,
  NewspaperIcon as SolidNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as SolidChatIcon,
  VideoCameraIcon as SolidVideoCameraIcon,
  UserIcon as SolidUserIcon,
} from "@heroicons/react/24/solid";
import {
  HomeIcon as OutlineHomeIcon,
  NewspaperIcon as OutlineNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as OutlineChatIcon,
  VideoCameraIcon as OutlineVideoCameraIcon,
  UserIcon as OutlineUserIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import Link from "next/link";
export default function TabBar() {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 left-0 w-full border-neutral-600 border-t p-3 bg-neutral-800">
      <div className="grid grid-cols-4">
        <div className="flex flex-col items-center">
          <OutlineHomeIcon className="w-7 h-7" />
          Home
        </div>
        <div className="flex flex-col items-center">
          <OutlineHomeIcon className="w-7 h-7" />
          Community
        </div>
        <div className="flex flex-col items-center">
          <OutlineHomeIcon className="w-7 h-7" />
          Chat
        </div>
        <Link href="/profile" className="flex flex-col items-center text-white">
          {pathname === "/profile" ? (
            <SolidHomeIcon className="w-7 h-7" />
          ) : (
            <OutlineHomeIcon className="w-7 h-7" />
          )}
          Profile
        </Link>
      </div>
    </div>
  );
}
