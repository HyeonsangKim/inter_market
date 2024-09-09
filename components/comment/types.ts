export interface Comment {
  id: number;
  payload: string;
  created_at: string;
  user: {
    id: string;
    name: string;
  };
  replies?: Comment[];
}
