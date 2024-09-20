import { ProfileForm } from "@/components/profile-form";
import { db } from "@/lib/db";
import getCurrentUser from "@/lib/getCurrentUser";

async function getMyProducts(userId:string) {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photos: {
        select: {
          url: true,
        },
        take: 1,
      },
      
      id: true,
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
    },
    where:{
      userId
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return products.map((product) => ({
    ...product,
    firstPhoto: product.photos[0]?.url || null,
  }));
}


export default async function Profile() {
  const session = await getCurrentUser();
  const products = await getMyProducts(session!.id)

  return <ProfileForm userData={session} products={products} />;
}
