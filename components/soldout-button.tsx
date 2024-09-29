"use client";

import { useFormStatus } from "react-dom";

interface SoldOutButtonProps {
  productId: number;
  isSoldOut: boolean | null | undefined;
  onToggle: any;
  children: any;
}

export default function SoldOutButton({
  productId,
  isSoldOut,
  onToggle,
  children,
}: SoldOutButtonProps) {
  const handleClick = () => {
    onToggle(productId, isSoldOut || false);
  };
  const { pending } = useFormStatus();
  return (
    <button
      onClick={handleClick}
      className={`btn btn-primary`}
      disabled={pending}
    >
      {isSoldOut ? "판매중 처리" : "판매완료 처리"}
    </button>
  );
}
