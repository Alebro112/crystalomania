import { DCurrencyDTO } from "#controllers/currency";
import { DDepositDTO, RequestDepositDTO, RequestRollbackDepositDTO } from "#controllers/deposit";
import ApiError from "#middlewares/exceptions/api.error";
import { CustomLogger } from "#middlewares/logger/logger";
import { Transaction } from "sequelize";

export type getDepositsFunction = (
    logger: CustomLogger,
    transaction: Transaction | null = null,
) => Promise<[Array<DDepositDTO>, null ] | [null, ApiError]>;

export type makeDepositFunction = (
    depositDTO: RequestDepositDTO,
    logger: CustomLogger,
    transaction: Transaction,
) => Promise<[DDepositDTO, null] | [null, ApiError]>;

export type rollbackDepositFunction = (
    dto: RequestRollbackDepositDTO,
    logger: CustomLogger,
    transaction: Transaction
) => Promise<[DDepositDTO, null] | [null, ApiError]>

export type validateDepositFunction = (
    depositDTO: RequestDepositDTO,
    currencies: Array<DCurrencyDTO>,
) => RequestDepositDTO;

export type CurrenciesDict = { [key: string]: DCurrencyDTO };
