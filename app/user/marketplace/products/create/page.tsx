"use client";

import ImageUploader from "@/components/ImageUploader";
import { useState } from "react";
import { useFormState } from "react-dom";
import { uploadProduct } from "./action";
import PostForm from "@/components/postform";

// Image 타입 정의
interface Image {
  id: number;
  url: string;
  file?: File; // File 객체를 저장
}
export default function Page() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [images, setImages] = useState<Image[]>([]);

  const handleTitleChange = (title: string) => setTitle(title);
  const handleContentChange = (content: string) => setContent(content);
  const handlePriceChange = (price: number) => setPrice(price);
  const handleImageChange = (newImages: Image[]) => setImages(newImages);

  const [state, action] = useFormState(uploadProduct, null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("price", price.toString());

    images.forEach((image) => {
      if (image.file) {
        formData.append("photos", image.file);
      } else if (image.url) {
        // 만약 file이 없고 url만 있는 경우 (기존 이미지)
        formData.append("photos", image.url);
      }
    });

    await action(formData); // action에 FormData 전달
  };

  return (
    <div className='container mx-auto p-6'>
      <form onSubmit={handleSubmit}>
        <h1 className='text-2xl font-bold mb-4'>Create New Post</h1>
        <PostForm
          title={title}
          content={content}
          onTitleChange={handleTitleChange}
          onContentChange={handleContentChange}
        />
        <ImageUploader onImageChange={handleImageChange} />
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Price
          </label>
          <input
            type='number'
            name='price'
            value={price}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black'
            placeholder='Enter the price'
            required
          />
        </div>
        <button className='bg-blue-500 text-white px-4 py-2 rounded-md mt-4'>
          Submit
        </button>
      </form>
    </div>
  );
}
