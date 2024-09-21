// components/PostForm.tsx
import React from "react";

interface PostFormProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
}

const PostForm: React.FC<PostFormProps> = ({
  title,
  content,
  onTitleChange,
  onContentChange,
}) => {
  return (
    <div className='mb-4'>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>Title</label>
        <input
          type='text'
          name='title'
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
          name='content'
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black'
          rows={6}
          placeholder='Enter the content'
        />
      </div>
    </div>
  );
};

export default PostForm;
