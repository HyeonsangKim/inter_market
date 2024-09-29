export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  created_at: Date;
}

export interface UserInfoDropdownType {
  user: User;
}
