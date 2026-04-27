import { cookies } from "next/headers";
import type { Note } from "@/types/note";
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

async function cookieHeader() {
  const cookieStore = await cookies();
  return cookieStore.toString();
}

export const fetchNotes = async ({
  search,
  page,
  tag,
}: FetchNotesArgs = {}): Promise<FetchNotesResponse> => {
  const cookie = await cookieHeader();
  const res = await api.get<FetchNotesResponse>("/notes", {
    params: {
      ...(typeof search === "string" && search !== "" ? { search } : {}),
      ...(typeof page === "number" ? { page } : {}),
      perPage: 12,
      ...(typeof tag === "string" && tag !== "" ? { tag } : {}),
    },
    headers: {
      Cookie: cookie,
    },
  });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookie = await cookieHeader();
  const res = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookie,
    },
  });
  return res.data;
};

export const checkSession = async (): Promise<User | null> => {
  const cookie = await cookieHeader();
  const res = await api.get<User | "" | null>("/auth/session", {
    headers: {
      Cookie: cookie,
    },
    validateStatus: () => true,
  });
  return res.data ? (res.data as User) : null;
};

export const getMe = async (): Promise<User> => {
  const cookie = await cookieHeader();
  const res = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookie,
    },
  });
  return res.data;
};

