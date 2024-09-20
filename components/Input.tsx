import { InputHTMLAttributes } from "react";

interface Input {
  name: string;
  errors?: string[];
  value?: string | undefined;
}

export default function Input({
  errors = [],
  name,
  value,
  ...rest
}: Input & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        value={value || undefined}
        className="bg-transparent 
        rounded-md w-full h-10 p-3 focus:outline-none ring-2 focus:ring-4 transition ring-green-600 focus:ring-green-500 border-none placeholder:text-black"
        {...rest}
      />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
