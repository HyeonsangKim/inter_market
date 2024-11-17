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
    image?: string | null;
  };
  replies?: Comment[];
}
