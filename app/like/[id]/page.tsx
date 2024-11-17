import Image from "next/image";
import Link from "next/link";
import { Heart, Clock, MapPin, MessageCircle, Package } from "lucide-react";
import { getLikedItems } from "./action";
import { format } from "date-fns";
import { Pagination } from "@/components/CustomPagination";
import { getDisplayAddress } from "@/app/utils/utils";

export default async function LikedItemsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { productPage?: string; postPage?: string };
}) {
  const productPage = Number(searchParams.productPage) || 1;
  const postPage = Number(searchParams.postPage) || 1;

  const { products, posts, productPages, postPages } = await getLikedItems(
    params.id,
    productPage,
    postPage
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Liked Items</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Liked Products
          </h2>

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6">
                {products.map((product) => (
                  <Link
                    href={`/user/marketplace/products/${product.id}`}
                    key={product.id}
                    className="group"
                  >
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="flex flex-col sm:flex-row h-full">
                        <div className="relative w-full sm:w-[240px] aspect-[4/3] sm:aspect-square flex-shrink-0">
                          <Image
                            src={product.photos[0]?.url || "/placeholder.png"}
                            alt={product.title}
                            fill
                            className={`object-cover ${
                              !product.soldout && "group-hover:scale-105"
                            } transition-transform duration-300`}
                          />
                          {product.soldout && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                SOLD OUT
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                              {product.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {product.description}
                            </p>
                            <p className="text-lg font-semibold mb-2">
                              ₩ {product.price.toLocaleString()}
                            </p>
                          </div>

                          <div className="flex flex-col justify-between space-y-4">
                            <div className="flex items-center justify-between text-sm text-gray-500 flex-wrap gap-2">
                              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                                <div className="flex items-center gap-1 min-w-fit">
                                  <MapPin className="w-4 h-4 flex-shrink-0" />
                                  <span className="truncate">
                                    {getDisplayAddress(product)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4 flex-shrink-0" />
                                  {format(
                                    new Date(product.created_at),
                                    "dd/MM/yyyy"
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center text-red-500">
                                <Heart className="w-4 h-4 mr-1 fill-current" />
                                {product.likeCount}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t">
                              <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                  src={product.user.image || "/img/default.jpg"}
                                  alt={product.user.name || "/img/default.jpg"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-sm text-gray-600 truncate">
                                {product.user.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Pagination
                currentPage={productPage}
                totalPages={productPages}
                baseUrl={`/user/likes/${params.id}`}
                paramName="productPage"
              />
            </>
          ) : (
            <EmptyState type="product" />
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Liked Posts
          </h2>

          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6">
                {posts.map((post) => (
                  <Link
                    href={`/user/community/${post.id}`}
                    key={post.id}
                    className="group"
                  >
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-[180px] p-4">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.description}
                      </p>

                      <div className="flex flex-col justify-between h-[80px]">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {getDisplayAddress(post)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {format(new Date(post.created_at), "dd/MM/yyyy")}
                            </div>
                          </div>
                          <div className="flex items-center text-red-500">
                            <Heart className="w-4 h-4 mr-1 fill-current" />
                            {post.likeCount}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t">
                          <div className="relative w-6 h-6 rounded-full overflow-hidden">
                            <Image
                              src={post.user.image || "/img/default.jpg"}
                              alt={post.user.name || "/img/default.jpg"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {post.user.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Pagination
                currentPage={postPage}
                totalPages={postPages}
                baseUrl={`/user/likes/${params.id}`}
                paramName="postPage"
              />
            </>
          ) : (
            <EmptyState type="post" />
          )}
        </section>
      </div>
    </div>
  );
}

function EmptyState({ type }: { type: "product" | "post" }) {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">No liked {type}s yet</p>
    </div>
  );
}
