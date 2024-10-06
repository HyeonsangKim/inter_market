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
    <div className="bg-white shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Website Icon and Name */}
          <div className="flex items-center">
            <Link
              href="/user"
              className="ml-3 text-lg font-semibold text-gray-900 lg:text-xl"
            >
              🌏InterAgora
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-4 gap-4">
            <Link
              href="/user/community"
              className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Community
            </Link>

            <Link
              href="/user/marketplace/products/"
              className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Marketplace
            </Link>
            <Link
              href={`/chats`}
              className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium relative"
            >
              Chats
              <UnreadBadge count={unreadCount} />
            </Link>
          </nav>
          <div>
            <HamburgerButton user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
