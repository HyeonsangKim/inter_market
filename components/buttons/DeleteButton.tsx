"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteActionResult {
  success: boolean;
  error?: string;
}

interface ButtonProps {
  text: string;
  color: string;
  action: (id: number) => Promise<DeleteActionResult>;
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("정말로 삭제하시겠습니까?")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const result = await action(elementId);

      if (result.success) {
        // 즉시 리다이렉트
        if (route) {
          router.push(route);
          // 약간의 지연 후 refresh
          setTimeout(() => router.refresh(), 100);
        }
      } else {
        setError(result.error || "삭제 중 오류가 발생했습니다.");
      }
    } catch (e) {
      setError("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDeleting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            삭제 중...
          </>
        ) : (
          <>
            <Trash2 className="w-4 h-4 mr-2" />
            {text}
          </>
        )}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
