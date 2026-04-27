"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const setUser = useAuthStore((state) => state.setUser);

  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!isAuthenticated) return;
      if (user) {
        setUsername(user.username ?? "");
        return;
      }

      const me = await getMe();
      setUser(me);
      setUsername(me.username ?? "");
    };

    init().catch((err) => setError(err instanceof Error ? err.message : "Failed to load profile"));
  }, [isAuthenticated, user, setUser]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const updated = await updateMe({ username });
      setUser(updated);
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.profileCard} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Edit profile</h1>

        <div className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              className={css.input}
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {error ? <p>{error}</p> : null}

          <div className={css.actions}>
            <button className={css.saveButton} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            <button className={css.cancelButton} type="button" onClick={() => router.back()}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

