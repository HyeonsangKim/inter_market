// components/PostForm.tsx
import React from "react";

interface PostFormProps {
  title: string;
  content: string;
  price: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onPriceChange: (price: string) => void;
}

const PostForm: React.FC<PostFormProps> = ({
  title,
  content,
  price,
  onTitleChange,
  onContentChange,
  onPriceChange,
}) => {
  return (
    <div className='mb-4'>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>Title</label>
        <input
          type='text'
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black'
          placeholder='Enter the title'
        />
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Content
        </label>
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black'
          rows={6}
          placeholder='Enter the content'
        />
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>Price</label>
        <input
          type='text'
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black'
          placeholder='Enter the price'
        />
      </div>
    </div>
  );
};

export default PostForm;
