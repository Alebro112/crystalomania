export default class DCurrencyDTO {
    id: number;
    name: string;
    title: string;
    baseValue: number;
    rate: number;
    total: number;

    constructor(model: any) {
        this.id = model.id;
        this.name = model.name;
        this.title = model.title;
        this.baseValue = model.base_value;
        this.rate = model.rate;
        this.total = model.total;
    }
}