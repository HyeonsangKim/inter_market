"use client";
import { markProductAsSoldOut } from "@/app/user/marketplace/products/[id]/action";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

export function GoogleLogin() {
  return (
    <div
      className="primary-btn flex h-10 items-center justify-center gap-3"
      onClick={() => signIn("google", { callbackUrl: "/" })}
    >
      <span>Continue with Google</span>
    </div>
  );
}

export const customSignOut = () => {
  signOut({ callbackUrl: "/" });
};
export function Logout() {
  return (
    <div
      onClick={customSignOut}
      className="flex h-10 items-center justify-center text-red-600"
    >
      <button>signout</button>
    </div>
  );
}
