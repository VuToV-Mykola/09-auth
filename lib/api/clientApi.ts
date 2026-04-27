import type { User } from "@/types/user";
import { nextServer } from "./nextServer";

export type RegisterRequest = {
  email: string;
  password: string;
  username: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UpdateUserRequest = {
  username?: string;
};

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post("/auth/login", data);
  return res.data;
};

export const checkSession = async (): Promise<boolean> => {
  const res = await nextServer.get<{ success: boolean }>("/auth/session");
  return Boolean(res.data.success);
};

export const getMe = async (): Promise<User> => {
  const res = await nextServer.get<User>("/users/me");
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const updateMe = async (update: UpdateUserRequest): Promise<User> => {
  const res = await nextServer.patch<User>("/users/me", update);
  return res.data;
};

