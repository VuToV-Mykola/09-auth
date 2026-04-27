"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./ProfilePage.module.css";

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ensureUser = async () => {
      if (!isAuthenticated) return;
      if (user) return;

      try {
        const me = await getMe();
        setUser(me);
      } catch (err) {
        clearIsAuthenticated();
        setError(err instanceof Error ? err.message : "Failed to load profile");
      }
    };

    ensureUser();
  }, [isAuthenticated, user, setUser, clearIsAuthenticated]);

  const avatarSrc = useMemo(() => {
    if (user?.avatar) return user.avatar;
    if (!user?.email) return null;
    const seed = encodeURIComponent(user.email);
    return `https://ui-avatars.com/api/?name=${seed}&background=0D6EFD&color=fff&size=128`;
  }, [user?.avatar, user?.email]);

  return (
    <main className={css.mainContent}>
      <section className={css.profileCard} aria-label="Profile">
        <header className={css.header}>
          <h1 className={css.formTitle}>Profile</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit profile
          </Link>
        </header>

        <div className={css.avatarWrapper}>
          {avatarSrc ? (
            <img className={css.avatar} src={avatarSrc} alt="User avatar" width={96} height={96} />
          ) : null}
        </div>

        <div className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <p>
              <strong>Username:</strong> {user?.username ?? "—"}
            </p>
          </div>
          <p>
            <strong>Email:</strong> {user?.email ?? "—"}
          </p>
          {error ? <p>{error}</p> : null}
        </div>
      </section>
    </main>
  );
}

