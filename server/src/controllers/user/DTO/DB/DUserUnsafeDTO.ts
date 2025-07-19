
export default class DUser {
    id: number;
    login: string;
    password: string;
    name: string;
    admin: boolean;

    constructor(model: any) {
        this.id = model.id;
        this.login = model.login;
        this.password = model.password;
        this.name = model.name;
        this.admin = model.admin;
    }
}