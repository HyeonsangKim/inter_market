import { User as PrismaUser } from "@prisma/client";

// Omit을 사용하여 충돌나는 필드를 제거한 후 새로 정의
export type SessionUser = Omit<PrismaUser, "email"> & {
  email: string | null | undefined;
  supabase_created_at?: string;
  supabase_updated_at?: string;
};
export interface Post {
  id: string | number;
  title: string;
  content?: string;
  created_at: string | Date;
}

export interface Product {
  id: string | number;
  title: string;
  description?: string;
  price: number;
  firstPhoto: string | null;
  created_at: string | Date;
  user: {
    name: string | null;
  };
}

export interface Image {
  id: number;
  url: string;
  file?: File;
}
