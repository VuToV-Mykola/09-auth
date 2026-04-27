import type { ReactNode } from "react";
import css from "./LayoutNotes.module.css";

type Props = {
  sidebar: ReactNode;
  children: ReactNode;
};

export default function LayoutNotes({ sidebar, children }: Props) {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <section className={css.notesWrapper}>{children}</section>
    </div>
  );
}
