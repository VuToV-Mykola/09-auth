"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  children: React.ReactNode;
};

function isPrivatePath(pathname: string) {
  return pathname.startsWith("/notes") || pathname.startsWith("/profile");
}

function isAuthPath(pathname: string) {
  return pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
}

const AuthProvider = ({ children }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      setIsChecking(true);

      const hasSession = await checkSession();

      if (!hasSession) {
        clearIsAuthenticated();

        if (isPrivatePath(pathname)) {
          router.replace("/sign-in");
          setIsChecking(false);
          return;
        }

        setIsChecking(false);
        return;
      }

      if (isAuthPath(pathname)) {
        router.replace("/profile");
        setIsChecking(false);
        return;
      }

      if (!user) {
        const me = await getMe();
        setUser(me);
      }

      setIsChecking(false);
    };

    verify().catch(() => {
      clearIsAuthenticated();
      if (isPrivatePath(pathname)) router.replace("/sign-in");
      setIsChecking(false);
    });
  }, [pathname, router, setUser, clearIsAuthenticated, user]);

  if (isChecking && (isPrivatePath(pathname) || isAuthPath(pathname))) {
    return <p>Loading, please wait...</p>;
  }

  if (!isAuthenticated && isPrivatePath(pathname)) {
    return null;
  }

  return children;
};

export default AuthProvider;

