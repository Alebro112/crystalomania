import Dashboard from "@/components/dahboard/Dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title:
        "Dashboard | Кристаломания - PILIGRIM",
    description: "Страница с дашбордом команд и валют",
};

export default function Page() {
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div className="container 2xl:max-w-[1600px]">
                <Dashboard />
            </div>
        </div>
    );
}
