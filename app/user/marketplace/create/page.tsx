// pages/create-post.tsx
"use client";

import ImageUploader from "@/components/ImageUploader";
import PostForm from "@/components/PostForm";
import { useState } from "react";

// Image 타입 정의
interface Image {
  id: number;
  url: string;
}
export default function Page() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [images, setImages] = useState<Image[]>([]);

  const handleTitleChange = (title: string) => setTitle(title);
  const handleContentChange = (content: string) => setContent(content);
  const handlePriceChange = (price: string) => setPrice(price);
  const handleImageChange = (newImages: Image[]) => setImages(newImages);
  const handleSubmit = () => {
    // Post submission logic here
    console.log("Post Submitted", { title, content, price, images });
  };

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4'>Create New Post</h1>
      <PostForm
        title={title}
        content={content}
        price={price}
        onTitleChange={handleTitleChange}
        onContentChange={handleContentChange}
        onPriceChange={handlePriceChange}
      />
      <ImageUploader onImageChange={handleImageChange} />
      <button
        onClick={handleSubmit}
        className='bg-blue-500 text-white px-4 py-2 rounded-md mt-4'
      >
        Submit
      </button>
    </div>
  );
}
