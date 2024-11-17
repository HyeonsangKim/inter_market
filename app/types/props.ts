import {
  Address,
  AddressFilter,
  InitialProducts,
  Post,
  Product,
} from "./common";

export interface PostListProps {
  initialPosts: Post[];
  initialLocation: AddressFilter;
  isLoggedIn?: boolean;
}

export interface PostItemProps {
  post: Post;
}
export interface AddressProps {
  address: Address | null;
  userId: string | null;
}
export interface ProductListProps {
  initialProducts: InitialProducts;
  initialLocation: {
    province: string;
    city?: string;
    district: string;
  };
  isLoggedIn?: boolean;
}
export interface ProductItemProps {
  product: Product;
}
