import { sequelize } from '#config/db';

import { Team, DTeamDTO } from '#controllers/team';

import ApiError from '#middlewares/exceptions/api.error';
import {
    decreaseBalanceByDDepositDTOFunction,
    increaseBalanceByDDepositDTOFunction,
    insertTeamFunction,
    selectAllTeamsFunction,
    selectTeamByIdFunction,
} from './Types';

class TeamRepository {
    selectAllTeams: selectAllTeamsFunction = async (
        logger,
        transaction = null,
    ) => {
        try {
            const teams = await Team.findAll({ 
                order: [['id', 'ASC']],
                transaction 
            });

            return [teams.map((team) => new DTeamDTO(team)), null];
        } catch (error: any) {
            logger.error('Error getting teams', { error: error.stack });

            return [null, ApiError.BadRequest()];
        }
    };

    selectTeamById: selectTeamByIdFunction = async (
        id,
        logger,
        transaction = null,
    ) => {
        try {
            const team = await Team.findByPk(id, { transaction });

            return [new DTeamDTO(team), null];
        } catch (error: any) {
            logger.error('Error getting team', { error: error.stack });

            return [null, ApiError.BadRequest()];
        }
    };

    insertTeam: insertTeamFunction = async (
        requestTeamDTO,
        logger,
        transaction = null,
    ) => {
        try {
            const team = await Team.create(requestTeamDTO, { transaction });

            logger.info('Team created', { details: team });

            return [new DTeamDTO(team), null];
        } catch (error: any) {
            logger.error('Error creating team', { error: error.stack });

            return [null, ApiError.BadRequest()];
        }
    };

    increaseBalanceByDDepositDTO: increaseBalanceByDDepositDTOFunction = async (
        depositDTO,
        logger,
        transaction = null,
    ) => {
        try {
            const amout = depositDTO.amount;

            const result = await Team.update(
                { balance: sequelize.literal(`balance + ${amout}`) },
                { where: { id: depositDTO.teamId }, transaction },
            );

            return [result[0], null];
        } catch (error: any) {
            logger.error('Error increasing balance by deposit', {
                details: {
                    deposit: depositDTO,
                },
                error: error.stack,
            });

            return [null, ApiError.BadRequest()];
        }
    };

    decreaseBalanceByDDepositDTO: decreaseBalanceByDDepositDTOFunction = async (
        depositDTO,
        logger,
        transaction = null,
    ) => {
        try {
            const amout = depositDTO.amount;

            const result = await Team.update(
                { balance: sequelize.literal(`balance - ${amout}`) },
                { where: { id: depositDTO.teamId }, transaction },
            );

            return [result[0], null];
        } catch (error: any) {
            logger.error('Error decreasing balance by deposit', {
                details: {
                    deposit: depositDTO,
                },
                error: error.stack,
            });

            return [null, ApiError.BadRequest()];
        }
    };
}

export default new TeamRepository();
