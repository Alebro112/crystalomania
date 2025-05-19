export default class DTeamDTO {
    id: number;
    title: string;
    balance: number;
    color: string;

    constructor(model: any) {
        this.id = model.id;
        this.title = model.title;
        this.balance = model.balance;
        this.color = model.color
    }
}