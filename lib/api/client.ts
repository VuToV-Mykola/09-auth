import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.VITE_API_URL ??
  "https://notehub-public.goit.study/api";

const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN ?? process.env.NEXT_NOTEHUB_TOKEN ?? "";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});
