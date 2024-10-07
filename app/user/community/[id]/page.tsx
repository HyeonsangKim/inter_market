import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import LikeShareButtons from "@/components/lIke-share-btn";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import {
  EyeIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { Suspense } from "react";
import DeleteButton from "@/components/delete-button";
import Link from "next/link";
import { UserInfoDropdown } from "@/components/user-info-dropdown";
import {
  deletePost,
  getComments,
  getLikeStatus,
  getPost,
  incrementPostViews,
} from "./action";
import { CommentItem, CommentList } from "@/components/comment/commentList";
import { format } from "date-fns";

export type InitialProductsComments = Prisma.PromiseReturnType<
  typeof getComments
>;

async function getCachedPost(productId: number) {
  const cachedOperation = nextCache(getPost, ["post-detail"], {
    tags: [`post-detail-${productId}`],
  });
  return cachedOperation(productId);
}

async function getCachedLikeStatus(productId: number, userId: string) {
  const cachedOperation = nextCache(getLikeStatus, ["post-like-stauts"], {
    tags: [`post-like-status-${productId}`],
  });
  return cachedOperation(productId, userId);
}

async function getCachedCommentList(postId: number) {
  const cachedOperation = nextCache(getComments, ["post-comments"], {
    tags: [`post-comments-${postId}`],
  });
  return cachedOperation(postId);
}

function isClientSideRendering() {
  return typeof window !== "undefined";
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  const session = await getCurrentUserId();
  if (isNaN(id)) {
    return notFound();
  }
  const post = await getCachedPost(id);

  if (!post) {
    return notFound();
  }
  const { likeCount, isLiked } = await getCachedLikeStatus(id, session!.id);
  const comments = await getCachedCommentList(id);
  if (post && !isClientSideRendering()) {
    await incrementPostViews(id);
  }

  return (
    <div className="mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="mb-6 gap-2">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
          <UserInfoDropdown user={post.user} />
        </div>
        <div>
          <p className="flex items-center text-gray-600 mb-2">
            <MapPinIcon className="h-5 w-5 mr-2" />
            Location: {post.user.si}, {post.user.gu}
          </p>
          <div className="flex items-center text-gray-600">
            <ClockIcon className="h-4 w-4 mr-3" />
            <span>
              <span>{format(new Date(post.created_at), "yyyy-MM-dd")}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 gap-8">
        <div className="md:col-span-2">
          <p className="text-gray-700 mb-6">{post.description}</p>

          <div className="flex items-center gap-4 text-gray-600 text-sm mb-6">
            <div className="flex items-center">
              <EyeIcon className="h-5 w-5 mr-1" />
              <span>views {post.views}</span>
            </div>
            <LikeShareButtons
              isLiked={isLiked}
              likeCount={likeCount}
              postId={id}
            />
          </div>

          {session!.id === post.user.id && (
            <div className="flex gap-4 mb-8">
              <Link href={`/user/community/edit/${id}`}>
                <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors duration-200">
                  edit
                </button>
              </Link>
              <DeleteButton
                color="bg-red-100 text-red-600 hover:bg-red-200"
                text="delete"
                action={deletePost}
                route="/user/community"
                elementId={id}
              />
            </div>
          )}
          <h2 className="text-2xl font-semibold mb-4">Comment</h2>
          <Suspense
            fallback={
              <div className="text-center py-4">Comment loading...</div>
            }
          >
            {comments!.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={post.id}
                category={"post"}
                currentUser={String(session?.id)}
              />
            ))}
            <CommentList postId={String(post.id)} category="post" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
