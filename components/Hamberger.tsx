// components/HamburgerButton.tsx
"use client";
import React, { useState } from "react";
import SideBar from "./SideBar";

function HamburgerButton() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <div className='relative'>
      <button
        onClick={toggleSidebar}
        className='p-2 rounded-md text-gray-800 hover:bg-gray-200 focus:outline-none'
      >
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 6h16M4 12h16M4 18h16'
          />
        </svg>
      </button>

      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
}

export default HamburgerButton;
