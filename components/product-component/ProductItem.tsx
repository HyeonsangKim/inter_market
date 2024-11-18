import { Product } from "@/app/types/common";
import { getDisplayAddress } from "@/app/utils/utils";
import { format } from "date-fns";
import { Clock, Heart, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductItemProps {
  product: Product;
}

export function ProductItem({ product }: ProductItemProps) {
  const {
    id,
    title,
    description,
    price,
    photos,
    soldout,
    created_at,
    user,
    likeCount,
  } = product;

  return (
    <Link href={`/user/marketplace/products/${id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="flex flex-col">
          {/* 이미지 */}
          <div className="relative w-full aspect-[4/3] flex-shrink-0 overflow-hidden">
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
            <Image
              src={photos[0]?.url || "/placeholder.png"}
              alt={title}
              fill
              sizes="100vw"
              className={`object-cover transform duration-700 ease-out ${
                !soldout && "group-hover:scale-110"
              }`}
            />
            {soldout && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">SOLD OUT</span>
              </div>
            )}
          </div>

          {/* 텍스트 콘텐츠 */}
          <div className="p-3 group-hover:bg-gray-50 transition-colors duration-300">
            <h3 className="text-lg font-semibold mb-1 line-clamp-1">{title}</h3>
            {description && (
              <p className="text-gray-600 text-sm mb-1 line-clamp-2">
                {description}
              </p>
            )}
            <p className="text-lg font-semibold mb-2">
              ₩ {price.toLocaleString()}
            </p>

            {/* 주소와 날짜 */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="">{getDisplayAddress(product)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 flex-shrink-0" />
                {format(new Date(created_at), "dd/MM/yyyy")}
              </div>
            </div>

            {/* 유저와 좋아요 */}
            <div className="flex items-center justify-between border-t pt-3">
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={user.image || "/img/default.jpg"}
                    alt={user.name || "User"}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm text-gray-600 truncate">
                  {user.name}
                </span>
              </div>
              <div className="flex items-center text-red-500">
                <Heart className="w-4 h-4 mr-1 fill-current" />
                {likeCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
