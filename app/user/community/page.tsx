// app/user/community/page.tsx
import { getCurrentUser } from "@/app/utils/supabase/get-user";
import { db } from "@/lib/db";
import { getMorePosts } from "./action";
import PostList from "@/components/post-component/PostList";

export type Post = {
  user: {
    image: string | null;
    id: string;
    gu: string | null;
    name: string | null;
    si: string | null;
    dong: string | null;
  };
  id: number;
  title: string;
  description: string | null;
  created_at: Date;
};

export type InitialPosts = Post[];

export default async function PostListPage() {
  const session = await getCurrentUser();
  const user = session
    ? await db.user.findUnique({
        where: { id: session.id },
        select: { si: true, gu: true },
      })
    : null;

  const { posts: initialPosts } = await getMorePosts(
    1,
    user?.si || undefined,
    user?.gu || undefined,
    ""
  );

  return (
    <div className="container mx-auto w-full">
      <div>
        <PostList
          initialPosts={initialPosts}
          initialLocation={{ city: user?.si || "", district: user?.gu || "" }}
          isLoggedIn={!!session}
        />
      </div>
    </div>
  );
}
