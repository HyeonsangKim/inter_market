import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import ImageSlider from "@/components/image-slider";
import LikeShareButtons from "@/components/lIke-share-btn";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import {
  EyeIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import {
  deleteProduct,
  getComments,
  getLikeStatus,
  getProduct,
  incrementProductViews,
  markProductAsSoldOut,
} from "./action";
import { Prisma } from "@prisma/client";
import { Suspense } from "react";
import DeleteButton from "@/components/delete-button";
import Link from "next/link";
import { UserInfoDropdown } from "@/components/user-info-dropdown";
import { CommentItem, CommentList } from "@/components/comment/commentList";
import SoldOutButton from "@/components/soldout-button";

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
  const session = await getCurrentUserId();
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);

  if (!product) {
    return notFound();
  }
  const { likeCount, isLiked } = await getCachedLikeStatus(id, session!.id);

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
            위치: {product.user.si}, {product.user.gu}
          </p>
          <div className="flex items-center text-gray-600">
            <ClockIcon className="h-4 w-4 mr-3" />
            <span>{new Date(product.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <ImageSlider images={product.photos} soldout={product!.soldout} />

      <div className="mt-8 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">상품 정보</h2>
          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="flex items-center gap-4 text-gray-600 text-sm mb-6">
            <div className="flex items-center">
              <EyeIcon className="h-5 w-5 mr-1" />
              <span>조회 {product.views}</span>
            </div>
            <LikeShareButtons
              isLiked={isLiked}
              likeCount={likeCount}
              postId={id}
            />
          </div>

          {session!.id === product.user.id && (
            <div className="flex gap-4 mb-8">
              <Link href={`/user/marketplace/products/edit/${id}`}>
                <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors duration-200">
                  수정
                </button>
              </Link>
              <DeleteButton
                color="bg-red-100 text-red-600 hover:bg-red-200"
                text="삭제"
                action={deleteProduct}
                elementId={id}
              />
              <SoldOutButton
                productId={id}
                isSoldOut={product.soldout}
                onToggle={markProductAsSoldOut}
              >
                {product.soldout ? "판매중 처리" : "판매완료 처리"}
              </SoldOutButton>
            </div>
          )}

          <h2 className="text-2xl font-semibold mb-4">댓글</h2>
          <Suspense
            fallback={<div className="text-center py-4">댓글 로딩 중...</div>}
          >
            {comments!.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={product.id}
                category={"product"}
                currentUser={String(session?.id)}
              />
            ))}
            <CommentList postId={String(product.id)} category="product" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
