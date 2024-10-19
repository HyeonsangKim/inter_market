export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  created_at: Date;
}

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
export interface Comment {
  id: number;
  payload: string;
  created_at: Date;
  user: {
    id: string;
    name?: string | null;
  };
  replies?: Comment[];
}
