"use client";

import { updatePost } from "@/app/user/community/edit/[id]/action";
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";

export interface Post {
  id: number;
  title: string;
  description: string;
}

interface EditFormProps {
  postId: number;
  post: Post | null;
}

export default function EditForm({ postId, post }: EditFormProps) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    setIsEditing(true);
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    if (post) {
      setTitle(post.title);
      setContent(post.description);
    }
  };

  const handleTitleChange = (title: string) => setTitle(title);
  const handleContentChange = (content: string) => setContent(content);

  const [state, action] = useFormState(updatePost, null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", String(postId));
    formData.append("title", title);
    formData.append("content", content);

    await action(formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {isEditing ? "게시글 수정" : "새 게시글 등록"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
        >
          {isEditing ? "수정 완료" : "게시긇 작성하기"}
        </button>
      </form>
    </div>
  );
}
