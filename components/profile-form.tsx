"use client";

import { Edit, Mail } from "lucide-react";
import Image from "next/image";
import Button from "./button";

interface User {
  id: string | number; // ID는 문자열이나 숫자일 수 있습니다.
  name: string;
  email: string;
  image: string; // 이미지 URL을 문자열로 저장한다고 가정합니다.
  created_at: string | Date; // 날짜는 문자열이나 Date 객체로 저장될 수 있습니다.
}

export function ProfileForm(userData: User) {
  return (
    <div className='card mb-8'>
      <div className='p-6'>
        <div className='flex items-center'>
          <Image
            width={64}
            height={64}
            className='size-20 md:size-28 rounded-full'
            src={userData?.image || ""}
            alt={userData?.name!}
          />
          <div className='ml-6'>
            <h2 className='text-2xl font-bold text-gray-900'>
              {userData.name}
            </h2>
            <p className='text-gray-600 flex items-center mt-1'>
              <Mail size={16} className='mr-1' />
              {userData.email}
            </p>
            {/* <p className='text-gray-600 mt-1'>
                  Computer Science Student | Coffee Lover
                </p> */}
          </div>
        </div>
        <div className='mt-6 flex justify-between items-center'>
          <div>
            <span className='text-gray-600'>Joined: September 2023</span>
          </div>
          <Button variant='secondary'>
            <Edit size={16} className='mr-2' />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* User Posts */}
      {/* <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="card">
              <div className="p-6">
                <div className="flex items-center">
                  <img className="h-10 w-10 rounded-full object-cover" src="/api/placeholder/40/40" alt="User" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{post.author}</h3>
                    <p className="text-gray-600 text-sm">{post.timestamp}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-800">{post.content}</p>
                <div className="mt-4 flex items-center space-x-4">
                  <button className="text-gray-500 hover:text-primary-600 flex items-center">
                    <ThumbsUp size={20} className="mr-1" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="text-gray-500 hover:text-primary-600 flex items-center">
                    <MessageCircle size={20} className="mr-1" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="text-gray-500 hover:text-primary-600 flex items-center">
                    <Share2 size={20} className="mr-1" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div> */}

      {/* // <div className='p-5'>
    //   <div className='flex gap-10'>
    //     <Image
    //       width={64}
    //       height={64}
    //       className='size-20 md:size-28 rounded-full'
    //       src={userData?.image || ""}
    //       alt={userData?.name!}
    //     />
    //     <div className='flex flex-col gap-2'>
    //       <div>{userData?.name}</div>
    //       <div>{userData?.email}</div>
    //       <div>
    //         <Logout />
    //       </div>
    //       <Link
    //         href={{
    //           pathname: "/profile/edit",
    //         }}
    //         // as={`/profile/edit`}
    //       >
    //         <Button text='Edit Profile' />
    //       </Link>
    //     </div>
    //   </div>
    // </div>  */}
    </div>
  );
}
