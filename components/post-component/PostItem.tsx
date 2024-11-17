import { PostItemProps } from "@/app/types/props";
import { getDisplayAddress } from "@/app/utils/utils";
import { format } from "date-fns";
import { Clock, Heart, MapPin, UserCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function PostItem({ post }: PostItemProps) {
  return (
    <Link href={`/user/community/${post.id}`} key={post.id} className="group">
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
            <span className="text-sm text-gray-600">{post.user.name}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
