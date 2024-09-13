"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { Logout } from "@/components/client-button";
import Button from "@/components/Button";
import Link from "next/link";
import { useUser } from "@/components/userContext";

export default function Page() {
  const userData = useUser();
  console.log(userData.image);

  return (
    <div className='p-5'>
      <div className='flex gap-10'>
        <Image
          width={64}
          height={64}
          className='size-20 md:size-28 rounded-full'
          src={userData?.image || ""}
          alt={userData?.name!}
        />
        <div className='flex flex-col gap-2'>
          <div>{userData?.name}</div>
          <div>{userData?.email}</div>
          <div>
            <Logout />
          </div>
          <Link
            href={{
              pathname: "/profile/edit",
            }}
            // as={`/profile/edit`}
          >
            <Button text='Edit Profile' />
          </Link>
        </div>
      </div>
    </div>
  );
}
