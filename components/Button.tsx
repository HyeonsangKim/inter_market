"use client";

import { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

interface ButtonProps {
  children: any;
  variant: string;
}

export default function Button({
  children,
  variant = "primary",
  ...props
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();

  return (
    <button
      className={`btn ${
        variant === "primary" ? "btn-primary" : "btn-secondary"
      } ${pending ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={pending}
      {...props}
    >
      {pending ? "Loading..." : children}
    </button>
  );
}
