"use client";

import React, { useState } from "react";
import { Comment } from "./types";
import { useRouter } from "next/navigation";
import {
  deleteComment,
  updateComment,
} from "@/app/user/marketplace/products/[id]/action";
import { CommentForm } from "./Comment";

export function CommentList({
  postId,
  category,
}: {
  postId: string;
  category: string;
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
  postId: number;
  category: string;
  currentUser: string;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.payload);
  const router = useRouter();

  const handleNewReply = () => {
    setIsReplying(false);
  };

  const onDelete = async (commentId: number, postId: number) => {
    await deleteComment(commentId, postId);
    router.refresh();
  };

  const onEdit = async () => {
    await updateComment(comment.id, postId, editedContent);
    setIsEditing(false);
    router.refresh();
  };

  return (
    <div className="border-t py-4">
      <p className="font-semibold">{comment.user.name}</p>
      {isEditing ? (
        <div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border rounded text-black"
          />
          <button onClick={onEdit} className="text-blue-500 text-sm mt-1 mr-2">
            저장
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-500 text-sm mt-1"
          >
            취소
          </button>
        </div>
      ) : (
        <p>{comment.payload}</p>
      )}
      <p className="text-sm text-gray-500">
        {new Date(comment.created_at).toLocaleDateString()}
      </p>
      <button
        onClick={() => setIsReplying(!isReplying)}
        className="text-blue-500 text-sm mt-1 mr-2"
      >
        {isReplying ? "취소" : "답글"}
      </button>
      {currentUser === comment.user.id && (
        <>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-green-500 text-sm mt-1 mr-2"
          >
            수정
          </button>
          <button
            onClick={() => onDelete(comment.id, postId)}
            className="text-red-500 text-sm mt-1"
          >
            삭제
          </button>
        </>
      )}

      {isReplying && (
        <CommentForm
          postId={Number(postId)}
          parentId={comment.id}
          category={category}
          onCommentAdded={handleNewReply}
        />
      )}
      {comment!.replies! && (
        <div className="ml-8 mt-4">
          {comment!.replies!.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              category={category}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}
    </div>
  );
}
