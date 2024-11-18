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
import { format } from "date-fns";
import { Comment } from "@/app/types";
import { CommentForm } from "./Comment";
import Image from "next/image";
import { UserInfoDropdown } from "../UserInfoDropdown";
import Link from "next/link";

export function CommentList({
  postId,
  category,
}: {
  postId: string;
  category: string;
}) {
  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
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

  const handleNewReply = () => {
    setIsReplying(false);
  };

  const onDelete = async (commentId: number, postId: number) => {
    if (window.confirm("Delete this comment?")) {
      if (category === "product") {
        await deleteComment(commentId, postId);
      } else {
        await deletePostComment(commentId, postId);
      }
      router.refresh();
    }
  };

  const onEdit = async () => {
    if (editedContent.trim()) {
      if (category === "product") {
        await updateComment(comment.id, postId, editedContent);
      } else {
        await updatePostComment(comment.id, postId, editedContent);
      }
      setIsEditing(false);
      router.refresh();
    }
  };

  return (
    <div className="border-t border-gray-100 py-6">
      <div className="flex items-start space-x-3">
        {/* 프로필 이미지 (있다면) */}
        <Link
          href={`/profile/${comment.user.id}`}
          className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-200"
        >
          <Image
            src={comment.user.image || "/img/default.jpg"}
            alt={`${comment.user.name}'s profile image`}
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        </Link>
        <div className="flex-grow">
          {/* 헤더: 이름과 날짜 */}
          <div className="flex items-center justify-between mb-2">
            <Link href={`/profile/${comment.user.id}`}>
              <span className="font-medium text-gray-900">
                {comment.user.name}
              </span>
            </Link>
            <span className="text-sm text-gray-500">
              {format(new Date(comment.created_at), "yyyy.MM.dd")}
            </span>
          </div>

          {/* 내용 */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800"
                rows={3}
              />
              <div className="flex space-x-2">
                <button
                  onClick={onEdit}
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-800 whitespace-pre-wrap">
              {comment.payload}
            </p>
          )}

          {/* 액션 버튼들 */}
          <div className="mt-3 flex items-center space-x-4">
            {currentUser && (
              <>
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {isReplying ? "Cancel reply" : "Reply"}
                </button>

                {currentUser === comment.user.id && (
                  <>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(comment.id, postId)}
                      className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {/* 답글 폼 */}
          {isReplying && currentUser && (
            <div className="mt-4">
              <CommentForm
                postId={Number(postId)}
                parentId={comment.id}
                category={category}
                onCommentAdded={handleNewReply}
              />
            </div>
          )}

          {/* 답글 목록 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-4 pl-4 border-l border-gray-100">
              {comment.replies.map((reply) => (
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
      </div>
    </div>
  );
}
