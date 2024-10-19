"use client";
import Link from "next/link";
import React, { useRef, useEffect } from "react";
import { Logout } from "./buttons/client-button";
import { User } from "@/app/types/user";
import Image from "next/image";

interface ProfileSidebarProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

function ProfileSidebar({ user, isOpen, onClose }: ProfileSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl text-gray-800 transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
      ref={sidebarRef}
    >
      <button
        className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 transition-colors duration-200"
        onClick={onClose}
      >
        &times;
      </button>
      {user === null ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-xl font-semibold mb-4">로그인이 필요합니다</p>
          <Link
            href="/login"
            className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-200"
          >
            로그인
          </Link>
        </div>
      ) : (
        <div className="pt-12 px-6">
          <div className="flex items-center mb-8">
            <Image
              className="w-16 h-16 rounded-full mr-4 border-2 border-indigo-500"
              src={user.image || "/default.jpg"}
              width={64}
              height={64}
              alt="profile"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <nav>
            <ul className="space-y-2">
              <Link href={`/profile/${user.id}`}>
                <li
                  className="py-2 px-4 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
                  onClick={onClose}
                >
                  Profile
                </li>
              </Link>
              {/* <li
                className="py-2 px-4 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
                onClick={onClose}
              >
                설정
              </li> */}
              <li
                className="py-2 px-4 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
                onClick={onClose}
              >
                <Logout />
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default ProfileSidebar;
