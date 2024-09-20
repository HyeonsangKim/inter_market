import { ProfileForm } from "@/components/profile-form";
import { db } from "@/lib/db";
import getCurrentUser, { getCurrentUserId } from "@/lib/getCurrentUser";

async function getMyProducts(userId: string) {
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
    where: {
      userId,
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
async function getProfile(userId: string) {
  const currentUser = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      created_at: true,
    },
  });
  return currentUser;
}

export default async function Profile({ params }: { params: { id: string } }) {
  const userId = params.id;
  const user = await getProfile(userId);
  const products = await getMyProducts(user!.id);
  const session = await getCurrentUserId();
  let currentUser = false;
  if (session!.id === userId) {
    currentUser = true;
  }

  return (
    <ProfileForm
      userData={user}
      products={products}
      currentUser={currentUser}
    />
  );
}
