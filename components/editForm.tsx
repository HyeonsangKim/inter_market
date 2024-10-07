"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { updateProduct } from "@/app/user/marketplace/products/edit/[id]/action";
import { Camera, X } from "lucide-react";
import Image from "next/image";

interface Image {
  id: number;
  url: string;
  file?: File;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  photos: { url: string }[];
}

interface EditFormProps {
  productId: number;
  product: Product | null;
}

export default function EditForm({ productId, product }: EditFormProps) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [images, setImages] = useState<Image[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    setIsEditing(true);
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    if (product) {
      setTitle(product.title);
      setContent(product.description);
      setPrice(product.price.toLocaleString());
      setImages(
        product.photos.map((photo, index) => ({
          id: index,
          url: photo.url,
        }))
      );
    }
  };

  const handleTitleChange = (title: string) => setTitle(title);
  const handleContentChange = (content: string) => setContent(content);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setPrice(Number(value).toLocaleString());
  };

  const handleImageChange = (newImages: Image[]) => setImages(newImages);

  const [state, action] = useFormState(updateProduct, null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", String(productId));
    formData.append("title", title);
    formData.append("content", content);
    formData.append("price", price.replace(/,/g, ""));

    images.forEach((image) => {
      if (image.file) {
        formData.append("photos", image.file);
      } else {
        formData.append("photos", image.url);
      }
    });

    await action(formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {isEditing ? "상품 수정" : "새 상품 등록"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            상품명
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
            상품 설명
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

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            가격
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              id="price"
              value={price}
              onChange={handlePriceChange}
              className="w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0"
              required
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">₩</span>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">원</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상품 이미지
          </label>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {images.map((img) => (
              <div key={img.id} className="relative">
                <Image
                  src={img.url}
                  alt="Product"
                  width={100}
                  height={100}
                  className="rounded-lg object-cover w-full h-32"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages(images.filter((image) => image.id !== img.id))
                  }
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer h-32">
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      const newImage = {
                        id: Date.now(),
                        url: URL.createObjectURL(e.target.files[0]),
                        file: e.target.files[0],
                      };
                      handleImageChange([...images, newImage]);
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                />
                <Camera size={24} className="text-gray-400" />
              </label>
            )}
          </div>
          <p className="text-sm text-gray-500">
            최대 5장의 이미지를 업로드할 수 있습니다.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
        >
          {isEditing ? "수정 완료" : "상품 등록하기"}
        </button>
      </form>
    </div>
  );
}
