"use client";

interface ButtonProps {
  text: string;
  color: string;
  action: any;
  elementId: number;
}

export default function DeleteButton({
  text,
  color,
  action,
  elementId,
}: ButtonProps) {
  const actionFuntion = async () => {
    action(elementId);
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
