export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
  replies?: Comment[];
}
