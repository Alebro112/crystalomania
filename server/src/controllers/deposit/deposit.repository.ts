import { sequelize } from '#config/db';
import { ForeignKeyConstraintError } from 'sequelize';
import { Team } from '#controllers/team';

import { DDepositDTO, Deposit, DepositStatus } from '#controllers/deposit';
import {
    DepositStatusEnum,
    insertDepositFunction,
    selectDepositByIdFunction,
    selectDepositsFunction,
    updateDepositStatusFunction,
} from '#controllers/deposit/Types';

import ApiError from '#middlewares/exceptions/api.error';
import { QueryTypes } from 'sequelize';

import SequalizeErrorHelper from '#helpers/sequalizeError';

class DepositRepository {
    private sequalizeErrorHelper: SequalizeErrorHelper;

    constructor() {
        this.sequalizeErrorHelper = new SequalizeErrorHelper({
            foreignKeys: {
                deposits_status_id_fkey: {
                    path: ['statusId'],
                    message: 'Deposit status does not exist',
                },
                deposits_team_id_fkey: {
                    path: ['teamId'],
                    message: 'Team does not exist',
                },
            },
        });
    }

    selectDeposits: selectDepositsFunction = async (
        logger,
        transaction = null,
    ) => {
        try {
            const deposits = await Deposit.findAll({
                include: [
                    {
                        model: DepositStatus,
                        as: 'status',
                    },
                    {
                        model: Team,
                        as: 'team',
                    },
                ],
                order: [['created_at', 'DESC'], ['id', 'DESC']],
                transaction,
            });

            return [deposits.map((deposit) => new DDepositDTO(deposit)), null];
        } catch (error: any) {
            logger.error('Error getting deposits', {
                func: 'DepositRepository.selectDeposits',
                error: error.stack,
            });
            return [null, ApiError.BadRequest()];
        }
    };

    selectDepositById: selectDepositByIdFunction = async (
        id,
        logger,
        transaction,
    ) => {
        try {
            const deposit = await Deposit.findByPk(id, {
                transaction,
            });

            if (!deposit) {
                return [null, ApiError.BadRequest('Deposit does not exist')];
            }

            return [new DDepositDTO(deposit), null];
        } catch (error: any) {
            logger.error('Error getting deposit', {
                func: 'DepositRepository.selectDepositById',
                error: error.stack,
            });
            return [null, ApiError.BadRequest()];
        }
    };

    selectPopulatedDepositById: selectDepositByIdFunction = async (
        id,
        logger,
        transaction,
    ) => {
        try {
            const deposit = await Deposit.findByPk(id, {
                include: [
                    {
                        model: DepositStatus,
                        as: 'status',
                    },
                    {
                        model: Team,
                        as: 'team',
                    },
                ],
                transaction,
            });

            if (!deposit) {
                return [null, ApiError.BadRequest('Deposit does not exist')];
            }

            return [new DDepositDTO(deposit), null];
        } catch (error: any) {
            logger.error('Error getting deposit', {
                func: 'DepositRepository.selectDepositById',
                error: error.stack,
            });
            return [null, ApiError.BadRequest()];
        }
    };

    insertDeposit: insertDepositFunction = async (
        depositDTO,
        logger,
        transaction = null,
    ) => {
        let sql: string = '';
        let bind: {
            team_id?: number;
            details?: string;
            status?: DepositStatusEnum;
            [key: string]: any;
        } = {};
        try {
            const { teamId, details } = depositDTO;

            bind.team_id = teamId;
            bind.details = JSON.stringify(details);
            bind.status = DepositStatusEnum.COMPLETED;

            const selectParts: string[] = [];
            const currencyNames: string[] = [];
            let index: number = 1;

            for (const [name, count] of Object.entries(details)) {
                if (
                    typeof name !== 'string' ||
                    typeof count !== 'number' ||
                    count <= 0
                ) {
                    throw new Error(`Invalid deposit entry: ${name}: ${count}`);
                }

                const nameKey: string = `name_${index}`;
                const countKey: string = `count_${index}`;

                bind[nameKey] = name;
                bind[countKey] = count;

                selectParts.push(
                    `SELECT $${nameKey} AS name, $${countKey}::numeric AS count`,
                );
                currencyNames.push(`$${nameKey}`);
                index++;
            }

            const valueUnion: string = selectParts.join('\nUNION ALL\n');

            sql = `
                INSERT INTO deposits (team_id, amount, details, status_id, created_at, updated_at)
                SELECT
                    $team_id,
                    SUM(c.base_value::float * c.rate::float * v.count::float)::float,
                    $details,
                    $status,
                    NOW(),
                    NOW()
                FROM currencies c
                    JOIN (
                    ${valueUnion}
                    ) AS v ON v.name = c.name
                WHERE c.name IN (${currencyNames.join(', ')})
                RETURNING id
            `.trim();

            const id = (await sequelize.query(sql, {
                bind,
                transaction,
                nest: true,
                type: QueryTypes.SELECT,
            })) as any;

            console.log('result', id);

            if (id.length === 0 || !id[0]?.id) {
                return [null, ApiError.ServerError()];
            }

            return await this.selectPopulatedDepositById(
                id[0].id,
                logger,
                transaction,
            );
        } catch (error) {
            const sequalizeError = this.sequalizeErrorHelper.handle(error);

            if (sequalizeError) {
                return [null, sequalizeError];
            }

            logger.error('Error inserting deposit', {
                details: { sql, bind, depositDTO },
                error: error,
            });
            return [null, ApiError.BadRequest()];
        }
    };

    updateDepositStatus: updateDepositStatusFunction = async (
        id,
        status,
        logger,
        transaction = null,
    ) => {
        try {
            await Deposit.update(
                {
                    status_id: status,
                },
                {
                    where: {
                        id,
                    },
                    transaction,
                },
            );

            return await this.selectDepositById(id, logger, transaction);
        } catch (error) {
            const sequalizeError = this.sequalizeErrorHelper.handle(error);

            if (sequalizeError) {
                return [null, sequalizeError];
            }

            logger.error('Error updating deposit status', {
                func: 'DepositRepository.updateDepositStatus',
                details: { id, status },
                error: error,
            });
            return [null, ApiError.BadRequest()];
        }
    };
}

export default new DepositRepository();
