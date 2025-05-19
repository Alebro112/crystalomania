import { NextFunction, Request, Response } from "express"

import { DTeamDTO, RequestTeamSchema, teamService } from "#controllers/team"
import { parseZod } from "#helpers/zod"

class TeamController {
    async getAllTeams(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const [teams, error] = await teamService.getAllTeams(req.logger)
            if (error) {
                return next(error)
            }

            res.status(200).json(teams)
        } catch (error) {
            next(error)
        }
    }

    async createTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const requestTeam = parseZod(RequestTeamSchema, req.body)

            const [team, error] = await teamService.createTeam(requestTeam, req.logger)
            if (error) {
                return next(error)
            }

            res.status(200).json(team)
        } catch (error) {
            next(error)
        }
    }
}

export default new TeamController()