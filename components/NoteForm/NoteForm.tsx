"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import css from "./NoteForm.module.css";
import { createNote } from "@/lib/api";
import { initialDraft, useNoteStore } from "@/lib/store/noteStore";

type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

type FormValues = {
  title: string;
  content: string;
  tag: NoteTag;
};

export default function NoteForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
    onError: () => {},
  });

  const values: FormValues = {
    title: draft.title ?? initialDraft.title,
    content: draft.content ?? initialDraft.content,
    tag: (draft.tag as NoteTag) ?? (initialDraft.tag as NoteTag),
  };

  const formAction = async (formData: FormData) => {
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "");
    const tag = String(formData.get("tag") ?? "Todo") as NoteTag;

    mutate({ title, content, tag });
  };

  const handleChange: React.ChangeEventHandler<HTMLFormElement> = (e) => {
    const fd = new FormData(e.currentTarget);

    setDraft({
      title: String(fd.get("title") ?? ""),
      content: String(fd.get("content") ?? ""),
      tag: String(fd.get("tag") ?? "Todo"),
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form} action={formAction} onChange={handleChange}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          defaultValue={values.title}
          required
          minLength={3}
          maxLength={50}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={values.content}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select id="tag" name="tag" className={css.select} defaultValue={values.tag}>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          Create note
        </button>
      </div>
    </form>
  );
}
