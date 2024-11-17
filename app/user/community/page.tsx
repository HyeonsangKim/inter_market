import { getCurrentUser } from "@/app/utils/supabase/get-user";
import { db } from "@/lib/db";
import { getMorePosts } from "./action";
import PostList from "@/components/post-component/PostList";

export default async function PostListPage() {
  const session = await getCurrentUser();
  const user = session
    ? await db.user.findUnique({
        where: { id: session.id },
        select: { province: true, city: true, district: true },
      })
    : null;

  const { posts: initialPosts } = await getMorePosts(
    1,
    user?.province || undefined,
    user?.city || undefined,
    user?.district || undefined,
    ""
  );

  return (
    <div className="container mx-auto w-full">
      <div>
        <PostList
          initialPosts={initialPosts}
          initialLocation={{
            province: user?.province || "",
            city: user?.city || "",
            district: user?.district || "",
          }}
          isLoggedIn={!!session}
        />
      </div>
    </div>
  );
}
