"use client";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutLineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic } from "react";
import {
  dislikePost,
  dislikeProduct,
  likePost,
  likeProduct,
} from "@/app/utils/commonAction";

type ItemType = "product" | "post";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  itemId: number;
  type: ItemType;
}

export default function LikeButton({
  isLiked,
  likeCount,
  itemId,
  type,
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (previousState, payload) => ({
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked
        ? previousState.likeCount - 1
        : previousState.likeCount + 1,
    })
  );

  const onClick = async () => {
    reducerFn(undefined);
    console.log(state);

    if (state.isLiked) {
      if (type === "product") {
        await dislikeProduct(itemId);
      } else {
        await dislikePost(itemId);
      }
    } else {
      if (type === "product") {
        await likeProduct(itemId);
      } else {
        await likePost(itemId);
      }
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 transition-colors
        ${
          state.isLiked
            ? "bg-orange-500 text-white border-orange-500"
            : "hover:bg-neutral-800 hover:text-white"
        }`}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className="size-5" />
      ) : (
        <OutLineHandThumbUpIcon className="size-5" />
      )}
      <span>
        {state.isLiked ? "Unlike" : "Like"} ({state.likeCount})
      </span>
    </button>
  );
}
