import { DTeamDTO } from "#controllers/team";
import { DDepositStatusDTO } from "#controllers/deposit";
import { DepositStatusEnum } from "#controllers/deposit/Types";

export default class DDepositDTO {
    id: number;
    teamId: number;
    team?: DTeamDTO;
    statusId: DepositStatusEnum;
    status?: DDepositStatusDTO;
    amount: number;
    details: { [key: string]: number };
    createdAt: Date;

    constructor(model: any) {
        this.id = model.id || null;
        this.teamId = model.team_id || null;
        this.statusId = model.status_id || null;
        this.amount = model.amount || null;
        this.details = JSON.parse(model.details || 'null');
        this.createdAt = model.createdAt || null;

        if (model.status) this.status = new DDepositStatusDTO(model.status);
        if (model.team) this.team = new DTeamDTO(model.team);
    }
}