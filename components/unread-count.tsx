"use client";

import React from "react";

interface UnreadBadgeProps {
  count: number;
}

const UnreadBadge: React.FC<UnreadBadgeProps> = ({ count }) => {
  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {count > 99 ? "99+" : count}
    </span>
  );
};

export default UnreadBadge;
