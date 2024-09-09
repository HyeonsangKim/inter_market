"use client";

import React, { useState } from "react";
import { CommentForm } from "./Comment";
import { Comment } from "./types";
import { InitialProductsComments } from "@/app/user/marketplace/products/[id]/page";
import { useRouter } from "next/navigation";

interface ProductListProps {
  initialProducts: InitialProductsComments;
}
export function CommentList({
  postId,
  initialComments,
  category,
  currentUser,
}: {
  postId: string;
  initialComments: ProductListProps;
  category: string;
  currentUser: string;
}) {
  return (
    <div>
      <CommentForm
        postId={Number(postId)}
        parentId={null}
        category={category}
      />
    </div>
  );
}

export function CommentItem({
  comment,
  postId,
  category,
  currentUser,
}: {
  comment: Comment;
  postId: string;
  category: string;
  currentUser: string;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  console.log(comment);

  const handleNewReply = (newReply: Comment) => {
    setReplies([...replies, newReply]);
    setIsReplying(false);
  };

  return (
    <div className='border-t py-4'>
      <p className='font-semibold'>{comment.user.name}</p>
      <p>{comment.payload}</p>
      <p className='text-sm text-gray-500'>
        {new Date(comment.created_at).toLocaleDateString()}
      </p>
      <button
        onClick={() => setIsReplying(!isReplying)}
        className='text-blue-500 text-sm mt-1 mr-2'
      >
        {isReplying ? "취소" : "답글"}
      </button>
      {currentUser === comment.user.id && (
        <button
          onClick={() => onDelete(comment.id)}
          className='text-red-500 text-sm mt-1'
        >
          삭제
        </button>
      )}

      {isReplying && (
        <CommentForm
          postId={Number(postId)}
          parentId={comment.id}
          category={category}
          onCommentAdded={handleNewReply}
        />
      )}
      {comment.replies.length > 0 && (
        <div className='ml-8 mt-4'>
          {comment.replies.map((reply) => (
            <div key={reply.id} className='border-l-2 pl-4 py-2 mb-2'>
              <p className='font-semibold'>{reply.user.name}</p>
              <p>{reply.payload}</p>
              <p className='text-sm text-gray-500'>
                {new Date(reply.created_at).toLocaleDateString()}
              </p>
              {currentUser === comment.user.id && (
                <button
                  onClick={() => onDelete(comment.id)}
                  className='text-red-500 text-sm mt-1'
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
