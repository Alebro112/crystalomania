import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import DepositsTable from "@/components/tables/deposits/DepositTable";
import { OverlayLoader } from "@/components/ui/overlayLoader";
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
