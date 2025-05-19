import { Transaction } from 'sequelize';

import { DTeamDTO, RequestTeamDTO, teamRepository } from '#controllers/team';

import { CustomLogger } from '#middlewares/logger/logger';
import ApiError from '#middlewares/exceptions/api.error';

class TeamService {
    async getAllTeams(
        logger: CustomLogger,
    ): Promise<[Array<DTeamDTO> | null, ApiError | null]> {
        return await teamRepository.selectAllTeams(logger);
    }

    async createTeam(
        dto: RequestTeamDTO,
        logger: CustomLogger,
    ): Promise<[DTeamDTO | null, ApiError | null]> {
        return await teamRepository.insertTeam(dto, logger);
    }
}

export default new TeamService();
