import { sequelize } from '#config/db';
import { QueryTypes } from 'sequelize';

import ApiError from '#middlewares/exceptions/api.error';

import { Currency, DCurrencyDTO } from '#controllers/currency';
import {
    decreaseTotalByDDepositDTOFunction,
    increaseTotalByDDepositDTOFunction,
    recalculateRateFunction,
    selectAllCurrenciesFunction,
} from './Types';
import logger from '#config/logger';

class CurrencyService {
    selectAllCurrencies: selectAllCurrenciesFunction = async (
        logger,
        transaction = null,
    ) => {
        try {
            const currencies = await Currency.findAll({ transaction, order: [['id', 'ASC']] });

            return [
                currencies.map((currency: any) => new DCurrencyDTO(currency)),
                null,
            ];
        } catch (error: any) {
            logger.error('Error getting currencies', { error: error.stack });

            return [null, ApiError.BadRequest()];
        }
    };

    increaseTotalByDDepositDTO: increaseTotalByDDepositDTOFunction = async (
        depositDTO,
        logger,
        transaction = null,
    ) => {
        let sql = '';
        let bind: { [key: string]: any } = {};
        try {
            const deposit = depositDTO.details;

            const cases: string[] = [];
            const nameList: string[] = [];

            let index = 1;

            for (let [name, amount] of Object.entries(deposit)) {
                if (
                    typeof name !== 'string' ||
                    typeof amount !== 'number' ||
                    amount <= 0
                ) {
                    return [
                        null,
                        ApiError.BadRequest(
                            `Invalid deposit entry: ${name}: ${amount}`,
                        ),
                    ];
                }

                const nameKey = `name_${index}`;

                cases.push(`WHEN "name" = $${nameKey} THEN ${amount}`);
                nameList.push(`$${nameKey}`);

                bind[nameKey] = name;
                index++;
            }

            sql = `
                UPDATE "currencies"
                SET "total" = "total" + CASE
                ${cases.join(' ')}
                END
                WHERE "name" IN (${nameList.join(', ')});
            `;

            const rowAffected = await sequelize.query(sql, {
                bind: bind,
                transaction,
                type: QueryTypes.BULKUPDATE,
            });

            return [rowAffected, null];
        } catch (error) {
            logger.error('Error getting currency', {
                details: {
                    sql,
                    bind,
                },
                error: error,
            });
            return [null, ApiError.BadRequest()];
        }
    };

    decreaseTotalByDDepositDTO: decreaseTotalByDDepositDTOFunction = async (
        depositDTO,
        logger,
        transaction = null,
    ) => {
        let sql = '';
        let bind: { [key: string]: any } = {};
        try {
            const deposit = depositDTO.details;

            const cases: string[] = [];
            const nameList: string[] = [];

            let index = 1;

            for (let [name, amount] of Object.entries(deposit)) {
                if (
                    typeof name !== 'string' ||
                    typeof amount !== 'number' ||
                    amount <= 0
                ) {
                    return [
                        null,
                        ApiError.BadRequest(
                            `Invalid deposit entry: ${name}: ${amount}`,
                        ),
                    ];
                }

                const nameKey = `name_${index}`;

                cases.push(`WHEN "name" = $${nameKey} THEN ${amount}`);
                nameList.push(`$${nameKey}`);

                bind[nameKey] = name;
                index++;
            }

            sql = `
                UPDATE "currencies"
                SET "total" = "total" - CASE
                ${cases.join(' ')}
                END
                WHERE "name" IN (${nameList.join(', ')});
            `;

            const rowAffected = await sequelize.query(sql, {
                bind: bind,
                transaction,
                type: QueryTypes.BULKUPDATE,
            });

            return [rowAffected, null];
        } catch (error) {
            logger.error('Error getting currency', {
                details: {
                    sql,
                    bind,
                },
                error: error,
            });
            return [null, ApiError.BadRequest()];
        }
    };

    recalcalculateRate: recalculateRateFunction = async (
        logger,
        transaction = null,
    ) => {
        try {
            const sql = `
                WITH stats AS (
                    SELECT
                        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total)::float AS median_total
                    FROM currencies
                ),
                calc AS (
                    SELECT
                        id,
                        (1 / (1 + POWER(c.total::float / (s.median_total + 0.0001), 1.1))) - 0.5 AS x
                    FROM currencies c
                    CROSS JOIN stats s
                )
                UPDATE currencies c
                    SET rate = 1 + (1.2 * calc.x) + (POWER(calc.x, 3) / 0.41)
                FROM calc
                WHERE c.id = calc.id;
            `;

            const rowAffected = await sequelize.query(sql, {
                transaction,
                type: QueryTypes.BULKUPDATE,
            });

            return [rowAffected, null];
        } catch (error: any) {
            logger.error('Error recalculating rate', { error: error.stack });

            return [null, ApiError.ServerError()];
        }
    };
}

export default new CurrencyService();
