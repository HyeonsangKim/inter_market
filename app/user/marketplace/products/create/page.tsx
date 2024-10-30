"use client";

import { useState } from "react";
import { uploadProduct } from "./action";
import { Camera, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductImage {
  id: number;
  url: string;
  file?: File;
}

export default function CreateProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file, index) => ({
        id: Date.now() + index,
        url: URL.createObjectURL(file),
        file,
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const removeImage = (id: number) => {
    setImages((prevImages) => {
      const imageToRemove = prevImages.find((img) => img.id === id);
      if (imageToRemove?.url) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prevImages.filter((img) => img.id !== id);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", description);
      const numericPrice = parseFloat(price.replace(/,/g, ""));
      formData.append("price", numericPrice.toString());

      images.forEach((image) => {
        if (image.file) {
          formData.append("photos", image.file);
        } else if (image.url) {
          formData.append("photos", image.url);
        }
      });

      const result = await uploadProduct(null, formData);

      if (result.success) {
        // 성공 시 이미지 URL 정리
        images.forEach((img) => {
          if (img.url) {
            URL.revokeObjectURL(img.url);
          }
        });
        router.push("/user/marketplace/products");
        router.refresh();
      } else {
        setError(
          result.error?.formErrors?.[0] || "업로드 중 오류가 발생했습니다."
        );
      }
    } catch (e) {
      setError("업로드 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPrice(e.target.value);
    setPrice(formatted);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-24 sm:pb-6">
      <h1 className="text-3xl font-bold mb-8 text-center">New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            product name
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
            disabled={isLoading}
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            price
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
              disabled={isLoading}
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
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  disabled={isLoading}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {images.length < 7 && !isLoading && (
              <label className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer h-32">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  multiple
                  disabled={isLoading}
                />
                <Camera size={24} className="text-gray-400" />
              </label>
            )}
          </div>
          <p className="text-sm text-gray-500">
            최대 7장의 이미지를 업로드할 수 있습니다.
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
}
