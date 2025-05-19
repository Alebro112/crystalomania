import { DDepositDTO } from "@/api/DTO/DB/DDeposit";
import { TableCell, TableRow } from "@/components/ui/table";
import formatLocalDate from "@/func/formatLocalData";

interface DepositTableRowProps {
    deposit: DDepositDTO
}

export default function DepositTableRow({
    deposit
}: DepositTableRowProps) {
    return (
        <TableRow>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {deposit.id}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {deposit.team?.title || deposit.teamId}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {deposit.amount}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {deposit.status?.name || deposit.statusId}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                <div className="flex flex-col gap-y-1.5">
                    {Object.entries(deposit.details).map(([key, value]) => {
                        return (
                            <span key={`deposit-details-${deposit.id}-${key}`}>{key}: {value}</span>
                        )
                    })}
                </div>
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {formatLocalDate(deposit.createdAt)}
            </TableCell>
        </TableRow>
    )
}