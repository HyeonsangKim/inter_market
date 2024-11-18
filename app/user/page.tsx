import PopularItems from "@/components/PopularItems";
import { fetchPopularPosts, fetchPopularProducts } from "./actions";

export default async function Page() {
  const popularProducts = await fetchPopularProducts();
  const popularPosts = await fetchPopularPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <PopularItems title="Popular Products" products={popularProducts} />
      <PopularItems title="Popular Posts" posts={popularPosts} />
    </div>
  );
}
