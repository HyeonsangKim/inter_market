import { User as PrismaUser } from "@prisma/client";

export interface CreateUserData {
  id: string;
  email: string;
  name: string;
  image: string | null;
}
export type SessionUser = Omit<PrismaUser, "email"> & {
  email: string | null | undefined;
  supabase_created_at?: string;
  supabase_updated_at?: string;
};

export interface Image {
  id: number;
  url: string;
  file?: File;
}
export interface BaseUser {
  id: string;
  name: string | null;
  image: string | null;
  province: string | null;
  city: string | null;
  district: string | null;
}

export interface Address {
  province: string | null;
  city: string | null;
  district: string | null;
  fullAddress?: string | null;
}

export interface AddressFilter {
  province: string;
  city?: string;
  district: string;
}
export interface Post {
  id: number;
  title: string;
  description: string | null;
  created_at: Date;
  likeCount?: number | null;
  user: BaseUser;
}

export type InitialPosts = Post[];

export interface Product {
  id: number;
  title: string;
  description?: string | null;
  price: number;
  photos: { url: string }[];
  soldout?: boolean | null;
  created_at: Date;
  user: BaseUser;
  likeCount?: number;
}
export type InitialProducts = Product[];
