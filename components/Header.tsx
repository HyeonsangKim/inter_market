import Link from "next/link";
import Image from "next/image";
import getCurrentUser from "@/lib/getCurrentUser";
import { getUnreadMessagesCount } from "@/app/chats/actions";
import UnreadBadge from "./unread-count";
import {
  Home,
  Users,
  ShoppingBag,
  Heart,
  MessageCircle,
  User,
  LogIn,
} from "lucide-react";
import { redirect } from "next/navigation";

export default async function ResponsiveHeader() {
  const user = await getCurrentUser();
  let unreadCount = 0;

  if (user) {
    unreadCount = await getUnreadMessagesCount(user.id);
  }

  return (
    <>
      {/* Desktop Header */}
      <header className="bg-white shadow-lg w-full sticky top-0 z-50 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/user"
              className="flex items-center space-x-2 text-xl font-bold text-indigo-600 hover:text-indigo-700 transition duration-300"
            >
              <span className="text-2xl">🌏</span>
              <span>InterAgora</span>
            </Link>

            <nav className="flex space-x-4">
              <Link
                href="/user/community"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Community
              </Link>
              <Link
                href="/user/marketplace/products/"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Market
              </Link>
              {user && (
                <>
                  <Link
                    href={`/like/${user.id}`}
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium relative transition duration-300"
                  >
                    Like
                    <UnreadBadge count={unreadCount} />
                  </Link>
                  <Link
                    href={`/chats`}
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium relative transition duration-300"
                  >
                    Chats
                    <UnreadBadge count={unreadCount} />
                  </Link>
                </>
              )}
            </nav>

            {user ? (
              <Link href={`/profile/${user.id}`}>
                <Image
                  src={user.image || "/default-avatar.png"}
                  alt="User profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          {user ? (
            <>
              <Link
                href="/user"
                className="flex flex-col items-center text-gray-600 hover:text-indigo-600"
              >
                <Home size={24} />
                <span className="text-xs mt-1">Home</span>
              </Link>
              <Link
                href="/user/community"
                className="flex flex-col items-center text-gray-600 hover:text-indigo-600"
              >
                <Users size={24} />
                <span className="text-xs mt-1">Community</span>
              </Link>
              <Link
                href="/user/marketplace/products/"
                className="flex flex-col items-center text-gray-600 hover:text-indigo-600"
              >
                <ShoppingBag size={24} />
                <span className="text-xs mt-1">Market</span>
              </Link>
              <Link
                href={`/like/${user.id}`}
                className="flex flex-col items-center text-gray-600 hover:text-indigo-600 relative"
              >
                <Heart size={24} />
                <span className="text-xs mt-1">Like</span>
                <UnreadBadge count={unreadCount} />
              </Link>
              <Link
                href="/chats"
                className="flex flex-col items-center text-gray-600 hover:text-indigo-600 relative"
              >
                <MessageCircle size={24} />
                <span className="text-xs mt-1">Chats</span>
                <UnreadBadge count={unreadCount} />
              </Link>
              <Link
                href={`/profile/${user.id}`}
                className="flex flex-col items-center text-gray-600 hover:text-indigo-600"
              >
                <User size={24} />
                <span className="text-xs mt-1">Profile</span>
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="flex flex-col items-center text-gray-600 hover:text-indigo-600"
            >
              <LogIn size={24} />
              <span className="text-xs mt-1">Login</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
