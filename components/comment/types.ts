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
