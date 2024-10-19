"use client";

import { useRouter } from "next/navigation";

interface ButtonProps {
  text: string;
  color: string;
  action: any;
  route?: string;
  elementId: number;
}

export default function DeleteButton({
  text,
  color,
  action,
  route,
  elementId,
}: ButtonProps) {
  const router = useRouter();
  const actionFuntion = async () => {
    const success = await action(elementId);
    if (success) {
      if (route) {
        router.push(route);
        router.refresh();
      }
    }
  };

  return (
    <button
      onClick={() => actionFuntion()}
      className={`text-${color} disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed`}
    >
      {text}
    </button>
  );
}
