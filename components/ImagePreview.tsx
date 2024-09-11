import Image from "next/image";
import React from "react";

interface ImagePreviewProps {
  image: {
    id: number;
    url: string;
  };
  onDelete: (id: number) => void;
}

function ImagePreview({ image, onDelete }: ImagePreviewProps) {
  return (
    <div className='relative'>
      <Image
        width={96} // 증가된 크기 (24 * 4)
        height={96} // 증가된 크기 (24 * 4)
        src={image.url}
        alt='Preview'
        className='w-24 h-24 object-cover rounded-lg shadow-md'
        quality={100} // 최대 품질
        priority={true} // 이미지 우선 로딩
      />
      <button
        onClick={() => onDelete(image.id)}
        className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center'
      >
        &times;
      </button>
    </div>
  );
}

export default ImagePreview;
