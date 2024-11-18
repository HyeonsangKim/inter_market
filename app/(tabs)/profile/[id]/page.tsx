import { getCurrentUser } from "@/app/utils/supabase/get-user";
import { ProfileForm } from "@/components/ProfileForm";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

async function getMyPosts(userId: string) {
  const posts = await db.post.findMany({
    select: {
      title: true,
      created_at: true,
      id: true,
      description: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          created_at: true,
          province: true,
          city: true,
          district: true,
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

  return posts;
}

async function getMyProducts(userId: string) {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      description: true,
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
          email: true,
          image: true,
          created_at: true,
          province: true,
          city: true,
          district: true,
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

  return products;
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
      province: true,
      city: true,
      district: true,
    },
  });
  return currentUser;
}

export default async function Profile({ params }: { params: { id: string } }) {
  const userId = params.id;
  const user = await getProfile(userId);
  if (!user) {
    redirect("/404"); // 또는 다른 페이지
  }
  const products = await getMyProducts(user!.id);
  const posts = await getMyPosts(user!.id);
  const session = await getCurrentUser();
  const currentUser = session?.id === userId;

  return (
    <ProfileForm
      userData={user}
      posts={posts}
      products={products}
      currentUser={currentUser}
    />
  );
}
