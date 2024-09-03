// components/LikeShareButtons.tsx
"use client";

import React, { useState } from "react";
import { HeartIcon, ShareIcon } from "lucide-react";

export default function LikeShareButtons({
  postId,
  initialLikes,
}: {
  postId: string;
  initialLikes: number;
}) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = async () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    // TODO: API 호출하여 좋아요 상태 업데이트
  };

  const handleShare = () => {
    // TODO: 공유 기능 구현
    alert("공유 기능이 클릭되었습니다.");
  };

  return (
    <div className='flex items-center space-x-4 mb-4'>
      <button
        onClick={handleLike}
        className={`flex items-center space-x-1 ${
          liked ? "text-red-500" : "text-gray-500"
        }`}
      >
        <HeartIcon />
        <span>{likes}</span>
      </button>
      <button
        onClick={handleShare}
        className='flex items-center space-x-1 text-gray-500'
      >
        <ShareIcon />
        <span>공유하기</span>
      </button>
    </div>
  );
}
