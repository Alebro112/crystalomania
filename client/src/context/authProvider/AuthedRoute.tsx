// components/AuthedRoute.tsx
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/store"; 
import { OverlayLoader } from "@/components/ui/overlayLoader";


type AuthedRouteProps = {
  children: React.ReactNode;
};

export const AuthedRoute = ({ children }: AuthedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUserStore((state) => state);

  useEffect(() => {
    const isOnSigninPage = pathname === "/signin";

    if (!loading && user === null && !isOnSigninPage) {
      router.replace("/signin");
    }
  }, [loading, user, router, pathname]);

  if (loading || user === null) {
    return <OverlayLoader />
  }

  return <>{children}</>;
};
