"use client";

import { useState } from "react";
import { Edit, Mail, FileText, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Button from "./button";
import Link from "next/link";

interface User {
  id: string | number;
  name: string;
  email: string;
  image: string;
  created_at: string | Date;
}

interface Post {
  id: string | number;
  title: string;
  content: string;
  created_at: string | Date;
}

interface Product {
  id: string | number;
  title: string;
  description: string;
  price: number;
  firstPhoto: string;
  created_at: string | Date;
  user: {
    name: string;
  };
}

export function ProfileForm({
  userData,
  posts,
  products,
}: {
  userData: User;
  posts?: Post[];
  products?: Product[];
}) {
  const [activeTab, setActiveTab] = useState<'posts' | 'products'>('posts');

  const postsCount = posts?.length ?? 0;
  const productsCount = products?.length ?? 0;

  return (
    <div className='space-y-8'>
      <div className='bg-white shadow rounded-lg overflow-hidden'>
        <div className='p-6'>
          <div className='flex flex-col sm:flex-row items-center'>
            <Image
              width={112}
              height={112}
              className='size-28 sm:size-32 rounded-full object-cover'
              src={userData?.image || "/placeholder-avatar.jpg"}
              alt={userData?.name || "User avatar"}
            />
            <div className='mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left'>
              <h2 className='text-2xl font-bold text-gray-900'>{userData.name}</h2>
              <p className='text-gray-600 flex items-center justify-center sm:justify-start mt-1'>
                <Mail size={16} className='mr-2' />
                {userData.email}
              </p>
              <p className='text-gray-500 mt-1'>
                Joined: {new Date(userData.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className='mt-6 flex justify-end'>
            <Link href="/profile/edit">
              <Button variant='secondary'>
                <Edit size={16} className='mr-2' />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className='bg-white shadow rounded-lg overflow-hidden'>
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex'>
            <button
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('posts')}
            >
              <FileText size={16} className='inline-block mr-2' />
              Posts ({postsCount})
            </button>
            <button
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('products')}
            >
              <ShoppingBag size={16} className='inline-block mr-2' />
              Products ({productsCount})
            </button>
          </nav>
        </div>
        <div className='p-4'>
          {activeTab === 'posts' && (
            <div className='space-y-4'>
              {postsCount > 0 ? (
                posts!.map((post) => (
                  <div key={post.id} className='bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition'>
                    <h3 className='text-lg font-semibold text-gray-900'>{post.title}</h3>
                    <p className='text-gray-600 mt-1 line-clamp-2'>{post.content}</p>
                    <p className='text-gray-400 text-sm mt-2'>
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className='text-gray-500 text-center py-4'>No posts yet.</p>
              )}
            </div>
          )}
          {activeTab === 'products' && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {productsCount > 0 ? (
                products!.map((product) => (
                  <div key={product.id} className='bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition'>
                    <Image
                      width={300}
                      height={200}
                      className='w-full h-48 object-cover'
                      src={product.firstPhoto || "/placeholder-product.jpg"}
                      alt={product.title}
                    />
                    <div className='p-4'>
                      <h3 className='text-lg font-semibold text-gray-900'>{product.title}</h3>
                      <p className='text-gray-600 mt-1 line-clamp-2'>{product.description}</p>
                      <p className='text-indigo-600 font-semibold mt-2'>${product.price.toFixed(2)}</p>
                      <p className='text-gray-400 text-sm mt-1'>
                        {new Date(product.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-gray-500 text-center py-4 col-span-full'>No products yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}