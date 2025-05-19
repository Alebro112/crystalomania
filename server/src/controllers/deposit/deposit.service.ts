import { sequelize } from '#config/db';
import { Transaction } from 'sequelize';

import {
    depositRepository,
    RequestDepositDTO,
    RequestDepositDTODetails,
} from '#controllers/deposit';
import { currencyRepository } from '#controllers/currency';

import ApiError from '#middlewares/exceptions/api.error';

import {
    CurrenciesDict,
    makeDepositFunction,
    getDepositsFunction,
    validateDepositFunction,
    rollbackDepositFunction,
    DepositStatusEnum,
} from '#controllers/deposit/Types';
import { teamRepository } from '#controllers/team';
import { CustomLogger } from '#middlewares/logger/logger';
import { RequestStressTestDepositDTO } from './DTO/Request/RequestStressTestDepositDTO';

class DepositService {
    getDeposits: getDepositsFunction = async (logger, transaction = null) => {
        return await depositRepository.selectDeposits(logger, transaction);
    };

    makeDeposit: makeDepositFunction = async (
        depositDTO,
        logger,
        transaction,
    ) => {
        try {
            const [currencies, currenciesError] =
                await currencyRepository.selectAllCurrencies(
                    logger,
                    transaction,
                );
            if (currenciesError) {
                throw currenciesError;
            }

            const validatedDTO = this.validateDeposit(depositDTO, currencies);

            const [deposit, depositError] =
                await depositRepository.insertDeposit(
                    validatedDTO,
                    logger,
                    transaction,
                );
            if (depositError) {
                throw depositError;
            }

            const [teamRowAffected, teamError] =
                await teamRepository.increaseBalanceByDDepositDTO(
                    deposit,
                    logger,
                    transaction,
                );
            if (teamError) {
                throw teamError;
            }
            if (teamRowAffected !== 1) {
                logger.error(
                    `Expected 1 row affected, got ${teamRowAffected}`,
                    {
                        func: 'DepositService.deposit',
                        details: {
                            currencies,
                            depositDTO,
                            validatedDTO,
                        },
                    },
                );
                throw ApiError.ServerError();
            }

            const [currencyRowAffected, currencyError] =
                await currencyRepository.increaseTotalByDDepositDTO(
                    deposit,
                    logger,
                    transaction,
                );
            if (currencyError) {
                throw currencyError;
            }
            if (currencyRowAffected < 1) {
                logger.error(
                    `Expected 1 row affected, got ${currencyRowAffected}`,
                    {
                        func: 'DepositService.deposit',
                        details: {
                            currencies,
                            depositDTO,
                            validatedDTO,
                        },
                    },
                );
                throw ApiError.ServerError();
            }

            const [rate, rateError] =
                await currencyRepository.recalcalculateRate(
                    logger,
                    transaction,
                );
            if (rateError) {
                throw rateError;
            }

            logger.info('Deposit created', {
                func: 'DepositService.deposit',
                details: {
                    deposit: deposit,
                    teamCountAffected: teamRowAffected,
                    currencyCountAffected: currencyRowAffected,
                    rateCountAffected: rate,
                },
            });
            return [deposit, null];
        } catch (error: ApiError | any) {
            if (!(error instanceof ApiError)) {
                logger.error('Error creating deposit', {
                    func: 'DepositService.deposit',
                    error: error.stack,
                });
                return [null, ApiError.ServerError()];
            }

            return [null, error];
        }
    };

    rollbackDeposit: rollbackDepositFunction = async (
        dto,
        logger,
        transaction,
    ) => {
        try {
            const [deposit, depositError] =
                await depositRepository.selectDepositById(
                    dto.id,
                    logger,
                    transaction,
                );
            if (depositError) {
                throw depositError;
            }
            if (!deposit || deposit.statusId !== DepositStatusEnum.COMPLETED) {
                return [null, ApiError.BadRequest('Deposit does not exist')];
            }

            const [updatedDeposit, updatedDepositError] =
                await depositRepository.updateDepositStatus(
                    dto.id,
                    DepositStatusEnum.ROLLBACKED,
                    logger,
                    transaction,
                );
            if (updatedDepositError) {
                throw updatedDepositError;
            }

            const [teamRowAffected, teamError] =
                await teamRepository.decreaseBalanceByDDepositDTO(
                    updatedDeposit,
                    logger,
                    transaction,
                );
            if (teamError) {
                throw teamError;
            }
            if (teamRowAffected !== 1) {
                logger.error(
                    `Expected 1 row affected, got ${teamRowAffected}`,
                    {
                        func: 'DepositService.rollbackDeposit',
                        details: {
                            deposit,
                            updatedDeposit,
                        },
                    },
                );
                throw ApiError.ServerError();
            }

            const [currencyRowAffected, currencyError] =
                await currencyRepository.decreaseTotalByDDepositDTO(
                    updatedDeposit,
                    logger,
                    transaction,
                );
            if (currencyError) {
                throw currencyError;
            }
            if (currencyRowAffected < 1) {
                logger.error(`No rows affected, got ${currencyRowAffected}`, {
                    func: 'DepositService.rollbackDeposit',
                    details: {
                        deposit,
                        updatedDeposit,
                    },
                });
                throw ApiError.ServerError();
            }

            const [rate, rateError] =
                await currencyRepository.recalcalculateRate(
                    logger,
                    transaction,
                );
            if (rateError) {
                throw rateError;
            }

            logger.info('Deposit rolled back', {
                func: 'DepositService.rollbackDeposit',
                details: {
                    deposit: updatedDeposit,
                    teamCountAffected: teamRowAffected,
                    currencyCountAffected: currencyRowAffected,
                    rateCountAffected: rate,
                },
            });

            return [updatedDeposit, null];
        } catch (error: ApiError | any) {
            if (error instanceof ApiError) {
                return [null, error];
            }

            logger.error('Error rolling back deposit', {
                func: 'DepositService.rollbackDeposit',
                error: error.stack,
            });
            return [null, ApiError.ServerError()];
        }
    };

    validateDeposit: validateDepositFunction = function (
        depositDTO,
        currencies,
    ) {
        let details = { ...depositDTO.details };
        const currenciesDict = currencies.reduce((acc, currency) => {
            acc[currency.name] = currency;
            return acc;
        }, {} as CurrenciesDict);

        details = Object.keys(details).reduce((acc, currency) => {
            if (details[currency] <= 0) {
                return acc;
            }

            if (currenciesDict[currency]) {
                acc[currency] = details[currency];
            }

            return acc;
        }, {} as RequestDepositDTODetails);

        return {
            ...depositDTO,
            details,
        };
    };

    runStressTest = async (
        dto: RequestStressTestDepositDTO,
        logger: CustomLogger,
    ) => {
        const startTime = Date.now();
        const results: { success: boolean; time: number; error?: string }[] =
            [];

        let activeRequests = 0;
        let totalRequests = 0;

        const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

        const fireOneRequest = async () => {
            activeRequests++;

            const before = Date.now();
            const transaction = await sequelize.transaction();
            try {
                await this.makeRandomDeposits(1, logger, transaction);
                await transaction.commit();
                const delta = Date.now() - before;

                if (dto.logSlowResponses && delta > dto.slowThresholdMs) {
                    console.warn(`⚠️ Долгий ответ: ${delta} мс`);
                }

                results.push({ success: true, time: delta });
            } catch (error) {
                const delta = Date.now() - before;
                console.error(`❌ Ошибка запроса (${delta} мс):`, error);
                results.push({
                    success: false,
                    time: delta,
                    error: String(error),
                });
            } finally {
                activeRequests--;
            }
        };

        const stressLoop = async () => {
            while (
                Date.now() - startTime < dto.durationMs &&
                (dto.maxTotalRequests < 0 ||
                    totalRequests < dto.maxTotalRequests)
            ) {
                const parallelCount = Math.max(
                    Math.floor(Math.random() * dto.maxConcurrent) + 1,
                    dto.maxTotalRequests - totalRequests,
                );

                const promises = Array.from({ length: parallelCount }, () =>
                    fireOneRequest(),
                );
                totalRequests += parallelCount;

                // if (dto.logProgress) {
                //     const elapsed =
                //         ((Date.now() - startTime) / dto.durationMs) * 100;
                //     console.log(
                //         `📊 Прогресс: ${elapsed.toFixed(1)}% | Активные: ${activeRequests} | Всего: ${totalRequests}`,
                //     );
                // }

                await Promise.allSettled(promises);

                if (dto.enableDelay) {
                    const delay =
                        Math.floor(
                            Math.random() *
                                (dto.maxDelayMs - dto.minDelayMs + 1),
                        ) + dto.minDelayMs;
                    await sleep(delay);
                }
            }
        };

        await stressLoop();

        // Финальная статистика
        const total = results.length;
        const errors = results.filter((r) => !r.success).length;
        const slow = results.filter((r) => r.time > dto.slowThresholdMs).length;
        const avgTime =
            results.reduce((acc, r) => acc + r.time, 0) / (total || 1);
        const maxTime = Math.max(...results.map((r) => r.time));

        console.log(`\n🔁 Завершён стресс-тест`);
        console.log(`Всего запросов: ${total}`);
        console.log(`Ошибок: ${errors}`);
        console.log(`Медленных (>${dto.slowThresholdMs}мс): ${slow}`);
        console.log(`Максимальное время ответа: ${maxTime} мс`);
        console.log(`Среднее время ответа: ${avgTime.toFixed(2)} мс`);
    };

    async makeRandomDeposits(
        count: number,
        logger: CustomLogger,
        transaction: Transaction,
    ) {
        const colors = ['red', 'blue', 'orange', 'yellow', 'green', 'purple'];

        for (let i = 0; i < count; i++) {
            const teamId = Math.floor(Math.random() * 4) + 1;

            // Выбираем 1–3 случайных цвета
            const shuffledColors = [...colors].sort(() => 0.5 - Math.random());
            const selectedColors = shuffledColors.slice(
                0,
                Math.floor(Math.random() * 3) + 1,
            );

            // Создаём объект с выбранными цветами и случайными значениями от 1 до 10
            const details: Record<string, number> = {};
            for (const color of colors) {
                details[color] = selectedColors.includes(color)
                    ? Math.floor(Math.random() * 10) + 1
                    : 0;
            }

            const dto: RequestDepositDTO = {
                teamId,
                details,
            };

            await this.makeDeposit(dto, logger, transaction);
        }
    }
}

export default new DepositService();
