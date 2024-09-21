import PostList from "@/components/post-list";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

async function getInitialPosts() {
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
          image: true,
          si: true,
          gu: true,
          dong: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return posts;
}

export type InitialPosts = Prisma.PromiseReturnType<typeof getInitialPosts>;

export default async function PostListPage() {
  const initialPosts = await getInitialPosts();
  console.log(initialPosts);

  return (
    <div className="container mx-auto w-full">
      <div>
        <PostList initialPosts={initialPosts} />
      </div>
    </div>
  );
}
