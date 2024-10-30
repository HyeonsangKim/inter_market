"use client";

import { Loader2, PackageX, ShoppingBag } from "lucide-react";
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
      onClick={() => onToggle(productId, isSoldOut || false)}
      disabled={pending}
      className={`inline-flex items-center justify-center px-3 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
        isSoldOut
          ? "bg-green-50 text-green-600 hover:bg-green-100"
          : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
      }`}
    >
      {pending ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : isSoldOut ? (
        <ShoppingBag className="w-4 h-4 mr-2" />
      ) : (
        <PackageX className="w-4 h-4 mr-2" />
      )}
      {isSoldOut ? "판매 중으로 변경" : "품절로 변경"}
    </button>
  );
}
