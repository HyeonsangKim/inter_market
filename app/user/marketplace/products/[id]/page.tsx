import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import { EyeIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/solid";
import {
  getComments,
  getLikeStatus,
  getProduct,
  incrementProductViews,
  markProductAsSoldOut,
} from "./action";
import { Prisma } from "@prisma/client";
import { Suspense } from "react";
import DeleteButton from "@/components/buttons/delete-button";
import Link from "next/link";
import { UserInfoDropdown } from "@/components/user-info-dropdown";
import { CommentItem, CommentList } from "@/components/comment/commentList";
import SoldOutButton from "@/components/buttons/soldout-button";
import { format } from "date-fns";
import ImageSlider from "@/components/image-component/image-slider";
import { getCurrentUser } from "@/app/utils/supabase/get-user";
import { deleteProduct } from "../edit/[id]/action";
import { Edit } from "lucide-react";
import LikeButton from "@/components/buttons/lIke-share-btn";
export type InitialProductsComments = Prisma.PromiseReturnType<
  typeof getComments
>;

async function getCachedProduct(productId: number) {
  const cachedOperation = nextCache(getProduct, ["product-detail"], {
    tags: [`product-detail-${productId}`],
  });
  return cachedOperation(productId);
}

async function getCachedLikeStatus(productId: number, userId: string) {
  const cachedOperation = nextCache(getLikeStatus, ["product-like-stauts"], {
    tags: [`product-like-status-${productId}`],
  });
  return cachedOperation(productId, userId);
}

async function getCachedCommentList(productId: number) {
  const cachedOperation = nextCache(getComments, ["product-comments"], {
    tags: [`product-comments-${productId}`],
  });
  return cachedOperation(productId);
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
  const session = await getCurrentUser();
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);

  if (!product) {
    return notFound();
  }
  const likeStatus = session
    ? await getCachedLikeStatus(id, session.id)
    : { likeCount: 0, isLiked: false };

  const comments = await getCachedCommentList(id);

  if (product && !isClientSideRendering()) {
    await incrementProductViews(id);
  }

  return (
    <div className="mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="mb-6 gap-2">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
          <UserInfoDropdown user={product.user} />
        </div>
        <p className="text-2xl font-normal mb-4">
          price : {product.price.toLocaleString()} 원
        </p>
        <div>
          <p className="flex items-center text-gray-600 mb-2">
            <MapPinIcon className="h-5 w-5 mr-2" />
            location: {product.user.si}, {product.user.gu}
          </p>
          <div className="flex items-center text-gray-600">
            <ClockIcon className="h-4 w-4 mr-3" />
            <span>{format(new Date(product.created_at), "yyyy-MM-dd")}</span>
          </div>
        </div>
      </div>

      <ImageSlider images={product.photos} soldout={product!.soldout} />

      <div className="mt-8 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Info</h2>
          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="flex items-center gap-4 text-gray-600 text-sm mb-6">
            <div className="flex items-center">
              <EyeIcon className="h-5 w-5 mr-1" />
              <span>view {product.views}</span>
            </div>
            {session ? (
              <LikeButton
                isLiked={likeStatus.isLiked}
                likeCount={likeStatus.likeCount}
                itemId={product.id}
                type="product"
              />
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors"
              >
                <span>로그인하고 좋아요 누르기</span>
              </Link>
            )}
          </div>

          {session?.id === product.user.id && (
            <div className="flex gap-4 mb-8">
              <Link
                href={`/user/marketplace/products/edit/${id}`}
                className="inline-flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-200"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
              <DeleteButton
                color="bg-red-100 text-red-600 hover:bg-red-200"
                text="삭제"
                action={deleteProduct}
                route="/user/marketplace/products"
                elementId={id}
              />
              <SoldOutButton
                productId={id}
                isSoldOut={product.soldout}
                onToggle={markProductAsSoldOut}
              >
                {product.soldout ? "On Sale" : "Sold Out"}
              </SoldOutButton>
            </div>
          )}

          <h2 className="text-2xl font-semibold mb-4">Comment</h2>
          <Suspense
            fallback={<div className="text-center py-4">Loading...</div>}
          >
            {comments!.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={product.id}
                category={"product"}
                currentUser={session?.id || ""}
              />
            ))}
            {session ? (
              <CommentList postId={String(product.id)} category="product" />
            ) : (
              <div className="text-center py-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-2">
                  댓글을 작성하려면 로그인이 필요합니다
                </p>
                <Link
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  로그인하러 가기
                </Link>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
