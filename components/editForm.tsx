"use client";

import ImageUploader from "@/components/ImageUploader";
import PostForm from "@/components/postform";
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { updateProduct } from "@/app/user/marketplace/edit/[id]/action";

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
  const [price, setPrice] = useState<number>(0);
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
      setPrice(product.price);
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
  const handlePriceChange = (price: number) => setPrice(price);
  const handleImageChange = (newImages: Image[]) => setImages(newImages);

  const [state, action] = useFormState(updateProduct, null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", String(productId));
    formData.append("title", title);
    formData.append("content", content);
    formData.append("price", price.toString());

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
    <div className='container mx-auto p-6'>
      <form onSubmit={handleSubmit}>
        <h1 className='text-2xl font-bold mb-4'>
          {isEditing ? "Edit Product" : "Create New Product"}
        </h1>
        <PostForm
          title={title}
          content={content}
          onTitleChange={handleTitleChange}
          onContentChange={handleContentChange}
        />
        <ImageUploader
          onImageChange={handleImageChange}
          initialImages={images}
        />
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
          {isEditing ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
}
