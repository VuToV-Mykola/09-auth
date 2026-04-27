import type { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export const metadata: Metadata = {
  title: "NoteHub | Create note",
  description: "Сторінка NoteHub для створення нової нотатки.",
  openGraph: {
    title: "NoteHub | Create note",
    description: "Сторінка NoteHub для створення нової нотатки.",
    url: `${getSiteUrl()}/notes/action/create`,
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
      },
    ],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
