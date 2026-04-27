"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api/clientApi";
import css from "@/components/NotePreview/NotePreview.module.css";

type Props = {
  noteId: string;
};

export default function NotePreviewClient({ noteId }: Props) {
  const router = useRouter();
  const close = () => router.back();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  const createdDate = new Date(note.createdAt).toLocaleDateString();

  return (
    <Modal onClose={close}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{createdDate}</p>
          <button className={css.backBtn} type="button" onClick={close}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
