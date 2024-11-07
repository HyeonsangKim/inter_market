import { createPostComment } from "@/app/user/community/[id]/action";
import { createComment } from "@/app/user/marketplace/products/[id]/action";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CommentForm({
  postId,
  parentId,
  category,
  onCommentAdded,
}: {
  postId: number;
  parentId?: number | null;
  category: string;
  onCommentAdded?: () => void;
}) {
  const [content, setContent] = useState("");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      if (category === "product") {
        await createComment(postId, parentId || null, content);
      } else {
        await createPostComment(postId, parentId || null, content);
      }

      onCommentAdded?.();
      setContent("");
      router.refresh();
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800"
        placeholder="Write a comment..."
        rows={4}
      />
      <button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md transition-colors
          ${
            isSubmitting || !content.trim()
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
      >
        {isSubmitting ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
