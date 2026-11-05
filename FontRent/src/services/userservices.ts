import api from "./api"
import type { ApiResult , User } from "../type/api"

// export async function test(): Promise<ApiResult<any>> {
//   try {
//     const response = await api.get<ApiResult<any>>("/test");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching user info:", error);
//     throw error;
//   } 

// }

export async function test(): Promise<User> {
  const response = await api.get<User>('/test');
  return response.data;
}