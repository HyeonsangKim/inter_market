import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";

interface BaseItemProps {
  id: number;
  title: string;
  likes: number;
  user: { name: string | null };
}

interface ProductItemProps extends BaseItemProps {
  type: "product";
  price: number;
  photos: { url: string }[];
  address: string;
  soldout: boolean | null;
}

interface PostItemProps extends BaseItemProps {
  type: "post";
}

type ItemProps = ProductItemProps | PostItemProps;

interface PopularItemsProps {
  title: string;
  items: ItemProps[];
  type: "product" | "post";
}

const ItemCard: React.FC<ItemProps> = (props) => {
  const { id, title, likes, user, type } = props;
  let url =
    type === "product" ? "/user/marketplace/products" : "/user/community";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <Link href={`${url}/${id}`}>
        {type === "product" && props.photos && props.photos[0] && (
          <div className="relative h-40">
            <Image
              src={props.photos[0].url}
              alt={title}
              layout="fill"
              objectFit="cover"
              className={props.soldout ? "filter blur-[2px]" : ""}
            />
            {props.soldout && (
              <Image
                fill
                src="/img/soldout.png"
                alt={title}
                className="object-contain"
              />
            )}
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 truncate">{title}</h3>
          {type === "product" && (
            <>
              <p className="text-indigo-600 font-bold mb-2">
                ${props.price.toFixed(2)}
              </p>
              <p className="text-gray-600 font-bold mb-2">{props.address}</p>
            </>
          )}
          {/* {type === "post" && (
            <p className="text-gray-600 mb-2 line-clamp-2">{props.content}</p>
          )} */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{user.name}</span>
            <div className="flex items-center space-x-2">
              <span className="flex items-center text-sm text-red-500">
                <Heart size={16} className="mr-1" /> {likes}
              </span>
              {/* {type === "post" && (
                <span className="flex items-center text-sm text-blue-500">
                  <MessageCircle size={16} className="mr-1" />{" "}
                  {props.commentCount}
                </span>
              )} */}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

const PopularItems: React.FC<PopularItemsProps> = ({ title, items, type }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    {items.length > 0 ? (
      <div
        className={`grid grid-cols-1 ${
          type === "product"
            ? "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
            : "md:grid-cols-2 lg:grid-cols-3"
        } gap-4`}
      >
        {items.map((item) => (
          <ItemCard key={item.id} {...item} />
        ))}
      </div>
    ) : (
      <p className="text-gray-600">
        No popular {type}s available at the moment.
      </p>
    )}
  </div>
);

export default PopularItems;
