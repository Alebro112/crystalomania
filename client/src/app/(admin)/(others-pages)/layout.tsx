"use client";

import { AuthedRoute } from "@/context/authProvider/AuthedRoute";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <AuthedRoute>
      {children}
    </AuthedRoute>
  );
}
