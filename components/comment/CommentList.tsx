"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteComment,
  updateComment,
} from "@/app/user/marketplace/products/[id]/action";
import {
  deletePostComment,
  updatePostComment,
} from "@/app/user/community/[id]/action";
import { CommentForm } from "./comment";
import { format } from "date-fns";
import { Comment } from "@/app/types";
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
  currentUser: string | null;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.payload);
  const router = useRouter();

  console.log(currentUser);

  const handleNewReply = () => {
    setIsReplying(false);
  };

  const onDelete = async (commentId: number, postId: number) => {
    if (category === "product") {
      await deleteComment(commentId, postId);
    } else {
      await deletePostComment(commentId, postId);
    }
    router.refresh();
  };

  const onEdit = async () => {
    if (category === "product") {
      await updateComment(comment.id, postId, editedContent);
    } else {
      await updatePostComment(comment.id, postId, editedContent);
    }
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
            submit
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-500 text-sm mt-1"
          >
            cancel
          </button>
        </div>
      ) : (
        <p>{comment.payload}</p>
      )}
      <p className="text-sm text-gray-500">
        {format(new Date(comment.created_at), "yyyy-MM-dd")}
      </p>

      {/* 버튼들을 currentUser 유무에 따라 다르게 표시 */}
      <div className="mt-1 space-x-2">
        {currentUser ? (
          // 로그인한 경우
          <>
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-blue-500 text-sm"
            >
              {isReplying ? "cancel" : "reply"}
            </button>

            {currentUser === comment.user.id && (
              <>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-green-500 text-sm"
                >
                  edit
                </button>
                <button
                  onClick={() => onDelete(comment.id, postId)}
                  className="text-red-500 text-sm"
                >
                  delete
                </button>
              </>
            )}
          </>
        ) : (
          // 로그인하지 않은 경우
          <></>
        )}
      </div>

      {isReplying && currentUser && (
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
