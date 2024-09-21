"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { uploadPost } from "./action";

interface ProductImage {
  id: number;
  url: string;
  file?: File;
}

export default function CreateProductPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [state, action] = useFormState(uploadPost, null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", description);

    await action(formData);
  };

  const formatPrice = (value: string) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, "");
    // Format with thousand separators
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">New Post</h1>
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
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            content
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
