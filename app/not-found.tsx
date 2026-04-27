import type { Metadata } from "next";
import css from "./not-found.module.css";

export const metadata: Metadata = {
  title: "NoteHub | 404",
  description: "NoteHub: сторінку не знайдено (404).",
  openGraph: {
    title: "NoteHub | 404",
    description: "NoteHub: сторінку не знайдено (404).",
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/404`,
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function NotFound() {
  return (
    <main>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
    </main>
  );
}
