"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createComment } from "@/app/user/marketplace/products/[id]/action";

export function CommentForm({
  postId,
  parentId,
  category,
}: {
  postId: string;
  parentId?: number;
  category: string;
}) {
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createComment(postId, content);
      setContent("");
      router.refresh();
    } catch (error) {
      console.error("댓글 작성 중 오류 발생:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='mt-4'>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className='w-full p-2 border rounded text-black'
        placeholder='댓글을 입력하세요...'
      />
      <button
        type='submit'
        className='mt-2 px-4 py-2 bg-blue-500 text-white rounded'
      >
        댓글 작성
      </button>
    </form>
  );
}
