export interface User {
  id?: number;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword?: string;
  image?: string;
  role?: 'admin' | 'user';
  session_token?: string;
}