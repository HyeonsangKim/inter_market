"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useSwipeable } from "react-swipeable";
interface ImageType {
  id: number;
  url: string;
}

interface ImageSliderProps {
  images: ImageType[];
}
export default function ImageSlider({ images }: ImageSliderProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    trackMouse: true,
  });

  return (
    <div className='relative w-full h-96 mb-4' {...handlers}>
      <Image
        src={images[currentImage].url}
        alt={`Product image ${currentImage + 1}`}
        layout='fill'
        objectFit='contain'
      />
      <button
        onClick={prevImage}
        className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2'
      >
        <ChevronLeftIcon color='black' />
      </button>
      <button
        onClick={nextImage}
        className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2'
      >
        <ChevronRightIcon color='black' />
      </button>
      <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2'>
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentImage ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
