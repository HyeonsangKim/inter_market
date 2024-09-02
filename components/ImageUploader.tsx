// components/ImageUploader.tsx
import React, { useState } from "react";
import ImagePreview from "./ImagePreview";

interface Image {
  id: number;
  url: string;
  file: File;
}

interface ImageUploaderProps {
  onImageChange: (images: Image[]) => void; // 이미지 배열을 인자로 받는 함수 타입
}

function ImageUploader({ onImageChange }: ImageUploaderProps) {
  const [images, setImages] = useState<Image[]>([]); // 상태의 타입을 Image[]로 설정

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).slice(0, 10 - images.length);

      if (fileArray.length + images.length > 10) {
        alert("You can only upload up to 10 images.");
        return;
      }

      const newImages: Image[] = fileArray.map((file, index) => ({
        id: Date.now() + index,
        url: URL.createObjectURL(file),
        file,
      }));
      const updatedImages = [...images, ...newImages].slice(0, 10);
      setImages(updatedImages);
      onImageChange(updatedImages);
    }
  };

  const handleImageDelete = (id: number) => {
    const updatedImages = images.filter((image) => image.id !== id);
    setImages(updatedImages);
    onImageChange(updatedImages);
  };

  return (
    <div className='mb-4'>
      <label className='block text-sm font-medium text-gray-700'>
        Images (up to 10): {images.length} / 10
        <input
          type='file'
          accept='image/*'
          multiple
          onChange={handleImageChange}
          className='mt-1 block w-full text-sm text-gray-500'
        />
      </label>
      <div className='flex flex-wrap gap-4 mt-4'>
        {images.map((image) => (
          <ImagePreview
            key={image.id}
            image={image}
            onDelete={handleImageDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageUploader;
