import type { NewNote, Note } from "@/types/note";
import type { User } from "@/types/user";
import { api } from "./api";

export type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
};

export type FetchNotesArgs = {
  search?: string;
  page?: number;
  tag?: string;
};

export const fetchNotes = async ({
  search,
  page,
  tag,
}: FetchNotesArgs = {}): Promise<FetchNotesResponse> => {
  const res = await api.get<FetchNotesResponse>("/notes", {
    params: {
      ...(typeof search === "string" && search !== "" ? { search } : {}),
      ...(typeof page === "number" ? { page } : {}),
      perPage: 12,
      ...(typeof tag === "string" && tag !== "" ? { tag } : {}),
    },
  });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (note: NewNote): Promise<Note> => {
  const res = await api.post<Note>("/notes", note);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UpdateUserRequest = {
  username?: string;
};

export const register = async (data: RegisterRequest) => {
  const res = await api.post<User>("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await api.post<User>("/auth/login", data);
  return res.data;
};

export const checkSession = async (): Promise<boolean> => {
  const res = await api.get<User | "" | null>("/auth/session", {
    validateStatus: () => true,
  });
  return Boolean(res.data);
};

export const getMe = async (): Promise<User> => {
  const res = await api.get<User>("/users/me");
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const updateMe = async (update: UpdateUserRequest): Promise<User> => {
  const res = await api.patch<User>("/users/me", update);
  return res.data;
};

