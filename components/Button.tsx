"use client";

import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

interface ButtonProps {
  children: any;
  variant?: string;
  action?: any;
}

export default function Button({
  children,
  variant = "primary",
  action,
  ...props
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();
  const router = useRouter();
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (action) {
      e.preventDefault();
      router.push("/user/marketplace/products");
      router.refresh();
    }
  };
  return (
    <button
      className={`btn ${
        variant === "primary" ? "btn-primary" : "btn-secondary"
      } ${pending ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={pending}
      onClick={handleClick()}
      {...props}
    >
      {pending ? "Loading..." : children}
    </button>
  );
}
