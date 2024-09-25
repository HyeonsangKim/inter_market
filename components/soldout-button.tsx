"use client";

import Button from "@/components/button";
import { useFormStatus } from "react-dom";

interface SoldOutButtonProps {
  productId: number;
  isSoldOut: boolean;
  onToggle: (productId: number, currentStatus: boolean) => Promise<void>;
}

export default function SoldOutButton({
  productId,
  isSoldOut,
  onToggle,
}: SoldOutButtonProps) {
  const handleClick = () => {
    onToggle(productId, isSoldOut);
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
