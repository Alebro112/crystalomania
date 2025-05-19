export default class DDepositStatusDTO {
    id: number;
    name: string;

    constructor(model: any) {
        this.id = model.id || null;
        this.name = model.name || null;
    }
}