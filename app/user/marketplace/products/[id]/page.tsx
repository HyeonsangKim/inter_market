import { notFound } from "next/navigation";
import { unstable_cache as nextCahce } from "next/cache";
import ImageSlider from "@/components/ImageSlider";
import LikeShareButtons from "@/components/LIkeShareBtn";
import { unstable_cache as nextCache } from "next/cache";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import { EyeIcon } from "@heroicons/react/24/solid";
import {
  deleteProduct,
  getComments,
  getLikeStatus,
  getProduct,
} from "./action";
import { CommentItem, CommentList } from "@/components/comment/CommentList";
import { Prisma } from "@prisma/client";
import { Suspense } from "react";
import DeleteButton from "@/components/delete-button";
import Link from "next/link";

export type InitialProductsComments = Prisma.PromiseReturnType<
  typeof getComments
>;

const getCachedProduct = nextCahce(getProduct, ["product-detail"], {
  tags: ["product-detail"],
  revalidate: 60,
});

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

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>{product.title}</h1>

      <ImageSlider images={product.photos} />

      <div className='mb-4'>
        <p className='text-2xl font-bold mb-2'>{product.price}</p>
        <p className='text-gray-600 mb-2'>판매자: {product.user.name}</p>
        <p className='text-gray-600 mb-4'>위치: {product.user.gu}</p>
        <p className='mb-4'>{product.description}</p>
        <div className='flex items-center gap-2 text-neutral-400 text-sm'>
          <EyeIcon className='size-5' />
          <span>조회 {product.views}</span>
        </div>
        <LikeShareButtons isLiked={isLiked} likeCount={likeCount} postId={id} />
        {session!.id === product.user.id && (
          <div className='flex gap-4 *:cursor-pointer'>
            <Link href={`/user/marketplace/edit/${id}`}>
              <button className='text-white'>수정</button>
            </Link>
            <DeleteButton
              color='red-600'
              text='삭제'
              action={deleteProduct}
              elementId={id}
            />
          </div>
        )}
        <Suspense fallback={<div>댓글 로딩 중...</div>}>
          {comments!.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={product.id}
              category={"product"}
              currentUser={String(session?.id)}
            />
          ))}
          <CommentList postId={String(product.id)} category='product' />
        </Suspense>
      </div>
    </div>
  );
}
