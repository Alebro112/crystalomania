import { CustomLogger } from "#middlewares/logger/logger";
import { Transaction } from "sequelize";
import DTeamDTO, { RequestTeamDTO } from "#controllers/team";
import ApiError from "#middlewares/exceptions/api.error";
import { DDepositDTO } from "#controllers/deposit";

export type selectAllTeamsFunction = (
    logger: CustomLogger,
    transaction: Transaction | null = null,
) => Promise<[Array<DTeamDTO>, null] | [null, ApiError]>;

export type selectTeamByIdFunction = (
    id: number,
    logger: CustomLogger,
    transaction: Transaction | null = null,
) => Promise<[DTeamDTO, null] | [null, ApiError]>

export type insertTeamFunction = (
    requestTeamDTO: RequestTeamDTO,
    logger: CustomLogger,
    transaction: Transaction | null = null,
) => Promise<[DTeamDTO, null] | [null, ApiError]>

export type increaseBalanceByDDepositDTOFunction = (
    depositDTO: DDepositDTO,
    logger: CustomLogger,
    transaction: Transaction | null = null
) => Promise<[number, null] | [null, ApiError]>

export type decreaseBalanceByDDepositDTOFunction = (
    depositDTO: DDepositDTO,
    logger: CustomLogger,
    transaction: Transaction | null = null
) => Promise<[number, null] | [null, ApiError]>

