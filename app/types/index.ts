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
export interface LoginState {
  success?: boolean;
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
}
export interface CreateAccountState {
  formError?: string;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string;
  success?: boolean;
  redirect?: string;
}
