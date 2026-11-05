export interface ApiResult<T> {
  code: boolean;
  message: string;
  data: T;
}


export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}