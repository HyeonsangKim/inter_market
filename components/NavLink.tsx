// components/nav-link.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  ShoppingBag,
  Heart,
  MessageCircle,
  User,
  LogIn,
} from "lucide-react";

const ICONS = {
  Home,
  Users,
  ShoppingBag,
  Heart,
  MessageCircle,
  User,
  LogIn,
} as const;

type IconType = keyof typeof ICONS;
const getIcon = (name: string, isActive: boolean) => {
  const props = {
    size: 24,
    className: isActive ? "text-indigo-600" : "text-gray-500",
  };

  switch (name) {
    case "Home":
      return <Home {...props} />;
    case "Users":
      return <Users {...props} />;
    case "ShoppingBag":
      return <ShoppingBag {...props} />;
    case "Heart":
      return <Heart {...props} />;
    case "MessageCircle":
      return <MessageCircle {...props} />;
    case "User":
      return <User {...props} />;
    case "LogIn":
      return <LogIn {...props} />;
    default:
      return <Home {...props} />;
  }
};
export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center space-x-1 px-4 py-2 rounded-full font-medium transition-all duration-200
          ${
            isActive
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
          }`}
    >
      {children}
    </Link>
  );
}

export function MobileNavLink({
  href,
  iconName,
  label,
}: {
  href: string;
  iconName: IconType;
  label: string;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/user" && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex flex-col items-center transition-colors duration-200 ${
        isActive ? "text-indigo-600" : "text-gray-600"
      }`}
    >
      {getIcon(iconName, isActive)}
      <span
        className={`text-xs mt-1 ${
          isActive ? "text-indigo-600" : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
