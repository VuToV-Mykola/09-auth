import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { AxiosResponse } from "axios";
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

async function cookieHeaderFromNext() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return cookieStore.toString();
}

function getSetCookieHeaders(res: Response): string[] {
  const anyHeaders = res.headers as unknown as { getSetCookie?: () => string[] };
  if (typeof anyHeaders.getSetCookie === "function") return anyHeaders.getSetCookie();
  const single = res.headers.get("set-cookie");
  return single ? [single] : [];
}

export async function checkSessionForProxy(cookieHeader: string) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/auth/session`, {
    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  const setCookies = getSetCookieHeaders(res);
  const data = (await res.json().catch(() => null)) as unknown;

  const success =
    typeof data === "object" && data !== null && "success" in data
      ? Boolean((data as { success?: unknown }).success)
      : Boolean(data);

  return { success, setCookies };
}

export const fetchNotes = async ({
  search,
  page,
  tag,
}: FetchNotesArgs = {}): Promise<FetchNotesResponse> => {
  const cookie = await cookieHeaderFromNext();
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
  const cookie = await cookieHeaderFromNext();
  const res = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookie,
    },
  });
  return res.data;
};

export const checkSession = async (): Promise<AxiosResponse<User | "" | null>> => {
  const cookie = await cookieHeaderFromNext();
  return api.get<User | "" | null>("/auth/session", {
    headers: {
      Cookie: cookie,
    },
    validateStatus: () => true,
  });
};

export const getMe = async (): Promise<User> => {
  const cookie = await cookieHeaderFromNext();
  const res = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookie,
    },
  });
  return res.data;
};

