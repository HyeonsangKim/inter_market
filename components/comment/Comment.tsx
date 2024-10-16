"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createComment } from "@/app/user/marketplace/products/[id]/action";
import { createPostComment } from "@/app/user/community/[id]/action";

export function CommentForm({
  postId,
  parentId,
  category,
  onCommentAdded,
}: {
  postId: number;
  parentId?: number | null;
  category: string;
  onCommentAdded?: () => void | undefined;
}) {
  const [content, setContent] = useState("");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (category === "product") {
        const newComment = await createComment(
          postId,
          parentId || null,
          content
        );
      } else {
        const newComment = await createPostComment(
          postId,
          parentId || null,
          content
        );
      }

      if (onCommentAdded) {
        onCommentAdded();
      }

      setContent("");
      router.refresh();
    } catch (error) {
      console.error("댓글 작성 중 오류 발생:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded text-black"
        placeholder="write comment..."
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isSubmitting ? "write..." : "submit"}
      </button>
    </form>
  );
}
