import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DepositsTable from "@/components/tables/deposits/DepositTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "История депозитов | Кристаломания - PILIGRIM",
    description: "Посмотреть все депозиты",
};

export default function FormElements() {
    return (
        <div>
            <PageBreadcrumb pageTitle="История депозитов" />
            <div className="grid grid-cols-1">
                <DepositsTable />
            </div>
        </div>
    );
}
