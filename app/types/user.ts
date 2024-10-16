export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  created_at: Date;
}

export interface UserInfoDropdownType {
  user: User | null;
}
