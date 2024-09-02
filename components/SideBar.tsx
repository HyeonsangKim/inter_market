"use client";
import Link from "next/link";
import React, { useRef, useEffect } from "react";
import { Logout } from "./ClientButton";

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Detect clicks outside the sidebar to close it
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
      className={`fixed top-0 right-0 h-full w-64 bg-white text-black transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out`}
      ref={sidebarRef}
    >
      <button className='absolute top-4 right-4 text-2xl' onClick={onClose}>
        &times;
      </button>
      <div className='pt-4'>
        <div className='flex items-center mb-4 p-4'>
          <img
            src='https://via.placeholder.com/50'
            alt='Profile'
            className='w-12 h-12 rounded-full mr-4'
          />
          <div>
            <h2 className='text-lg font-semibold'>John Doe</h2>
            <p className='text-sm text-gray-400'>john.doe@example.com</p>
          </div>
        </div>
        <nav>
          <ul className=''>
            <li
              className='py-2 hover:bg-gray-700 px-4 hover:text-white'
              onClick={onClose}
            >
              <Link href='/profile'>Profile</Link>
            </li>
            <li
              className='py-2 hover:bg-gray-700 px-4 hover:text-white'
              onClick={onClose}
            >
              Settings
            </li>
            <li
              className='py-2 hover:bg-gray-700 px-4 hover:text-white'
              onClick={onClose}
            >
              <Logout />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default ProfileSidebar;
