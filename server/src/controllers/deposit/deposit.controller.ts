import {
    depositService,
    RequestDepositSchema,
    RequestRollbackDepositSchema,
} from '#controllers/deposit';

import { parseZod } from '#helpers/zod';

import { ControllerFunction } from '#controllers/index';
import { sequelize } from '#config/db';
import { updateDashboard } from 'src/sockets';
import { RequestStressTestDepositSchema } from './DTO/Request/RequestStressTestDepositDTO';



class DepositController {
    getAll: ControllerFunction = async (req, res, next) => {
        try {
            const [deposits, error] = await depositService.getDeposits(
                req.logger,
            );
            if (error) {
                return next(error);
            }

            res.status(200).json(deposits);
        } catch (error) {
            next(error);
        }
    };

    deposit: ControllerFunction = async (req, res, next) => {
        const transaction = await sequelize.transaction();
        try {
            const depositDTO = parseZod(RequestDepositSchema, req.body);

            const [response, error] = await depositService.makeDeposit(
                depositDTO,
                req.logger,
                transaction,
            );
            if (error) {
                return next(error);
            }

            await transaction.commit();
            res.status(200).json(response);

            updateDashboard()
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    };

    rollback: ControllerFunction = async (req, res, next) => {
        const transaction = await sequelize.transaction();
        try {
            const rollbackDTO = parseZod(
                RequestRollbackDepositSchema,
                req.params,
            );

            const [deposit, error] = await depositService.rollbackDeposit(
                rollbackDTO,
                req.logger,
                transaction,
            );
            if (error) {
                throw error;
            }

            await transaction.commit();
            res.status(200).json({
                rollbackDTO,
                deposit,
            });

            updateDashboard()
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    };

    stressTest: ControllerFunction = async (req, res, next) => {
        try {
            const dto = parseZod(
                RequestStressTestDepositSchema,
                req.body
            )

            await depositService.runStressTest(
                dto,
                req.logger
            );
            res.status(200).json('completed');

            updateDashboard()
        } catch (error) {
            next(error);
        }
    };
}

export default new DepositController();
