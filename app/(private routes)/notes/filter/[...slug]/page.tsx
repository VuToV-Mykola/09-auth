import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function normalizeTag(tagParam?: string[]) {
  const raw = tagParam?.[0];
  if (!raw || raw === "all") return null;
  return raw;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = normalizeTag(slug);
  const filterLabel = tag ?? "all";

  const title = `NoteHub | Notes (${filterLabel})`;
  const description = `Сторінка нотаток NoteHub з фільтром: ${filterLabel}.`;
  const url = `${getSiteUrl()}/notes/filter/${filterLabel}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function NotesFilterPage({ params }: Props) {
  const { slug } = await params;
  const normalizedTag = normalizeTag(slug);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", normalizedTag ?? "all", "", 1],
    queryFn: () => fetchNotes({ page: 1, search: "", tag: normalizedTag ?? undefined }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={normalizedTag} />
    </HydrationBoundary>
  );
}
