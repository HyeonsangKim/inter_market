import PopularItems from "@/components/popular-items";
import { fetchPopularPosts, fetchPopularProducts } from "./actions";

export default async function Page() {
  const popularProducts = await fetchPopularProducts();
  const popularPosts = await fetchPopularPosts();
  console.log(popularProducts);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Welcome to Our Community
      </h1>

      <PopularItems
        title="Popular Products"
        items={popularProducts.map((p) => ({
          id: p.id,
          title: p.title,
          likes: p._count.likes,
          user: { name: p.user.name },
          type: "product",
          price: p.price,
          photos: p.photos,
          address: p.user.si + ", " + p.user.gu,
          soldout: p.soldout,
        }))}
        type="product"
      />

      <PopularItems
        title="Popular Posts"
        items={popularPosts.map((p) => ({
          id: p.id,
          title: p.title,
          likes: p._count.likes,
          user: { name: p.user.name },
          type: "post",
          content: p.content,
          commentCount: p._count.comments,
        }))}
        type="post"
      />
    </div>
  );
}
