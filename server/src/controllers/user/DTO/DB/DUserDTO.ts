
export default class DUser {
    id: number;
    login: string;
    name: string;
    admin: boolean;

    constructor(model: any) {
        this.id = model.id;
        this.login = model.login;
        this.name = model.name;
        this.admin = model.admin;
    }
}