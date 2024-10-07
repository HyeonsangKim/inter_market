import Link from "next/link";
import getCurrentUser from "@/lib/getCurrentUser";
import HamburgerButton from "./hamberger";
import { getUnreadMessagesCount } from "@/app/chats/actions";
import UnreadBadge from "./unread-count";

export default async function Header() {
  const user = await getCurrentUser();
  let unreadCount = 0;

  if (user) {
    unreadCount = await getUnreadMessagesCount(user.id);
  }

  return (
    <header className="bg-white shadow-lg w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Website Icon and Name */}
          <Link
            href="/user"
            className="flex items-center space-x-2 text-xl font-bold text-indigo-600 hover:text-indigo-700 transition duration-300"
          >
            <span className="text-2xl">🌏</span>
            <span className="hidden sm:inline">InterAgora</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex space-x-1 sm:space-x-4">
            <Link
              href="/user/community"
              className="text-gray-700 hover:text-indigo-600 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Community
            </Link>
            <Link
              href="/user/marketplace/products/"
              className="text-gray-700 hover:text-indigo-600 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Market
            </Link>
            <Link
              href={`/chats`}
              className="text-gray-700 hover:text-indigo-600 px-2 sm:px-3 py-2 rounded-md text-sm font-medium relative transition duration-300"
            >
              Chats
              <UnreadBadge count={unreadCount} />
            </Link>
          </nav>

          {/* Hamburger button - always visible */}
          <div>
            <HamburgerButton user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}
