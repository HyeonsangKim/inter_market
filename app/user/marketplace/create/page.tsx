"use client";

import ImageUploader from "@/components/ImageUploader";
import PostForm from "@/components/PostForm";
import { useState } from "react";
import { useFormState } from "react-dom";
import { uploadProduct } from "./action";

// Image 타입 정의
interface Image {
  id: number;
  url: string;
  file: File; // File 객체를 저장
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

    // FormData를 사용하여 데이터 전송
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("price", price.toString());

    images.forEach((image) => {
      console.log(image);

      // 이미지 URL을 Blob으로 변환하여 추가
      // 실제로는 Blob을 서버로 전송해야 하므로, Blob 데이터로 변경해야 합니다.
      // 여기서는 URL을 사용하므로 실제 파일 객체가 필요합니다.
      // 예를 들어, 파일이 필요하다면 파일 선택 시 Blob을 저장해야 합니다.
      formData.append("photos", image.file); // 실제로는 Blob 또는 File 객체여야 함
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
