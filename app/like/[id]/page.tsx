import Image from "next/image";
import Link from "next/link";
import { HeartIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { getLikedProducts } from "./action";

export default async function LikedPostsPage({
  params,
}: {
  params: { id: string };
}) {
  const userId = params.id;
  const likeProducts = await getLikedProducts(userId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Liked Products</h1>
      {likeProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likeProducts.map((product) => (
            <Link
              href={`/user/community/${product.id}`}
              key={product.id}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                    {product.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {product.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span>
                      {product.user.si}, {product.user.gu}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    <span>
                      {new Date(product.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-full transition-colors duration-200">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200">
                        <Image
                          src={product.user.image || "/default-avatar.png"}
                          alt={`${product.user.name}'s profile image`}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-gray-700 truncate max-w-[100px]">
                        {product.user.name}
                      </span>
                    </div>
                    <div className="flex items-center text-red-500">
                      <HeartIcon className="w-5 h-5 mr-1 fill-current" />
                      <span className="text-sm font-medium">
                        {product.likeCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          You haven&apos;t liked any posts yet.
        </p>
      )}
    </div>
  );
}
