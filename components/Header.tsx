import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Users,
  ShoppingBag,
  Heart,
  MessageCircle,
  LogIn,
} from "lucide-react";
import { getCurrentUser } from "@/app/utils/supabase/get-user";
import UnreadBadge from "./UnreadCount";
import { getUnreadMessagesCount } from "@/app/chats/actions";
import { MobileNavLink, NavLink } from "./NavLink";

export default async function ResponsiveHeader() {
  const user = await getCurrentUser();
  let unreadCount = 0;
  if (user) {
    unreadCount = await getUnreadMessagesCount(user.id);
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b w-full sticky top-0 z-50 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href={`${user ? "/user" : "/"}`}
              className="flex items-center space-x-3 text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors duration-300"
            >
              <span className="text-3xl ">🌏</span>
              <span className="font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InterAgora
              </span>
            </Link>

            <nav className="flex items-center space-x-1">
              <NavLink href="/user/community">
                <Users size={18} className="mb-0.5" />
                <span>Community</span>
              </NavLink>
              <NavLink href="/user/marketplace/products">
                <ShoppingBag size={18} className="mb-0.5" />
                <span>Market</span>
              </NavLink>
              {user && (
                <>
                  <NavLink href={`/like/${user.id}`}>
                    <Heart size={18} className="mb-0.5" />
                    <span>Like</span>
                  </NavLink>
                  <div className="relative">
                    <NavLink href="/chats">
                      <MessageCircle size={18} className="mb-0.5" />
                      <span>Chats</span>
                      {unreadCount > 0 && <UnreadBadge count={unreadCount} />}
                    </NavLink>
                  </div>
                </>
              )}
            </nav>

            {user ? (
              <Link
                href={`/profile/${user.id}`}
                className="flex items-center space-x-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-indigo-100">
                  <Image
                    src={user.image || "/img/default.jpg"}
                    alt="User profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 font-medium transition-all duration-200"
              >
                <LogIn size={18} className="mb-0.5" />
                <span>Sign in</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {user ? (
            <>
              <MobileNavLink href="/user" iconName="Home" label="Home" />
              <MobileNavLink
                href="/user/community"
                iconName="Users"
                label="Community"
              />
              <MobileNavLink
                href="/user/marketplace/products"
                iconName="ShoppingBag"
                label="Market"
              />
              <div className="relative">
                <MobileNavLink
                  href={`/like/${user.id}`}
                  iconName="Heart"
                  label="Like"
                />
              </div>
              <div className="relative">
                <MobileNavLink
                  href="/chats"
                  iconName="MessageCircle"
                  label="Chats"
                />
                {unreadCount > 0 && <UnreadBadge count={unreadCount} />}
              </div>
              <MobileNavLink
                href={`/profile/${user.id}`}
                iconName="User"
                label="Profile"
              />
            </>
          ) : (
            <MobileNavLink href="/login" iconName="LogIn" label="Login" />
          )}
        </div>
      </nav>
    </>
  );
}
