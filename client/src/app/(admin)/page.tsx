import type { Metadata } from "next";
import React from "react";
import Dashboard from "@/components/dahboard/Dashboard";

export const metadata: Metadata = {
  title:
    "Dashboard | Кристаломания - PILIGRIM",
  description: "Страница с дашбордом команд и валют",
};

export default function Ecommerce() {
  return (
    <Dashboard />
  );
}
