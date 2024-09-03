import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { unstable_cache as nextCahce, revalidateTag } from "next/cache";
import ImageSlider from "@/components/ImageSlider";
import LikeShareButtons from "@/components/LIkeShareBtn";
import CommentSection from "@/components/Comment";

async function getIsOwner(userId: number) {
  return false;
}

async function getProduct(id: number) {
  console.log("product");

  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          si: true,
          gu: true,
          dong: true,
        },
      },
      photos: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  });
  return product;
}
const getCachedProduct = nextCahce(getProduct, ["product-detail"], {
  tags: ["product-detail", "xxxx"],
});

export default async function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);
  console.log(product);

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>{product.title}</h1>

      <ImageSlider images={product.photos} />

      <div className='mb-4'>
        <p className='text-2xl font-bold mb-2'>{product.price}</p>
        <p className='text-gray-600 mb-2'>판매자: {product.user.name}</p>
        <p className='text-gray-600 mb-4'>위치: {product.user.gu}</p>
        <p className='mb-4'>{product.description}</p>

        <LikeShareButtons postId={product.id} initialLikes={product.title} />
      </div>

      {/* <CommentSection postId={postData.id} initialComments={comments} /> */}
    </div>
  );
}
