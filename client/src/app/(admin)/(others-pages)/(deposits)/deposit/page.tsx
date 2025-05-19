import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { MakeDepositFrom } from "@/components/form/deposit";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Сделать Депозит | Кристаломания - PILIGRIM",
  description: "Сделать депозит для команды",
};

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Сделать депозит" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <MakeDepositFrom />
        </div>
      </div>
    </div>
  );
}
