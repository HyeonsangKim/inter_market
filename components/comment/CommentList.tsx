"use client";

import React, { useState } from "react";
import { CommentForm } from "./Comment";
import { Comment } from "./types";

export function CommentList({
  postId,
  initialComments,
  category,
}: {
  postId: string;
  initialComments: Comment[];
  category: string;
}) {
  const [comments, setComments] = useState(initialComments);
  console.log(comments);

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          category={category}
        />
      ))}
    </div>
  );
}

function CommentItem({
  comment,
  postId,
  category,
}: {
  comment: Comment;
  postId: string;
  category: string;
}) {
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div className='border-b py-2 pl-4'>
      <p className='font-semibold'>{comment.user.name}</p>
      <p>{comment.payload}</p>
      <p className='text-sm text-gray-500'>
        {new Date(comment.created_at).toLocaleDateString()}
      </p>
      <button
        onClick={() => setIsReplying(!isReplying)}
        className='text-blue-500 text-sm mt-1'
      >
        답글
      </button>
      {isReplying && <CommentForm postId={postId} parentId={comment.id} />}
      {comment.replies && comment.replies.length > 0 && (
        <div className='ml-4 mt-2'>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              category={category}
            />
          ))}
        </div>
      )}
    </div>
  );
}
