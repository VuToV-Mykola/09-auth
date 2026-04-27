import type { NewNote, Note } from "@/types/note";
import { apiClient } from "./client";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

type FetchNotesArgs = {
  page: number;
  search: string;
  tag?: string;
};

export const fetchNotes = async ({
  page,
  search,
  tag,
}: FetchNotesArgs): Promise<FetchNotesResponse> => {
  const { data } = await apiClient.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      search,
      ...(tag ? { tag } : {}),
    },
  });

  return data;
};

export const createNote = async (note: NewNote): Promise<Note> => {
  const { data } = await apiClient.post<Note>("/notes", note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await apiClient.delete<Note>(`/notes/${id}`);
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await apiClient.get<Note>(`/notes/${id}`);
  return data;
};
