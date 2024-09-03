"use client";

import React, { useState } from "react";

type Comment = {
  id: number;
  user: string;
  content: string;
  createdAt: string;
};

export default function CommentSection({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 호출하여 새 댓글 추가
    const fakeNewComment = {
      id: Date.now(),
      user: "현재 사용자",
      content: newComment,
      createdAt: new Date().toISOString(),
    };
    setComments([...comments, fakeNewComment]);
    setNewComment("");
  };

  return (
    <div>
      <h2 className='text-xl font-bold mb-2'>댓글</h2>
      {comments.map((comment) => (
        <div key={comment.id} className='border-b py-2'>
          <p className='font-semibold'>{comment.user}</p>
          <p>{comment.content}</p>
          <p className='text-sm text-gray-500'>
            {new Date(comment.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
      <form onSubmit={handleSubmitComment} className='mt-4'>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className='w-full p-2 border rounded'
          placeholder='댓글을 입력하세요...'
        />
        <button
          type='submit'
          className='mt-2 px-4 py-2 bg-blue-500 text-white rounded'
        >
          댓글 작성
        </button>
      </form>
    </div>
  );
}
