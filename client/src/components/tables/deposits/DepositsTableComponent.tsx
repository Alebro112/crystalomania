import { DDepositDTO } from "@/api/DTO/DB/DDeposit";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import DepositTableRow from "./DepositTableRow";

interface DepositsTableComponentProps {
    deposits: DDepositDTO[];
}

export default function DepositsTableComponent({
    deposits
}: DepositsTableComponentProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    ID
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Команда
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Сумма
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Статус
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Детали
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Время депозита
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {deposits.map((deposit) => (
                                <DepositTableRow key={`deposit-${deposit.id}`} deposit={deposit} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}