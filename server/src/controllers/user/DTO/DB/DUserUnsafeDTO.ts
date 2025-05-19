
export default class DUser {
    id: number;
    login: string;
    password: string;
    name: string;
    admin: boolean;

    constructor(model: any) {
        this.id = model.id || null;
        this.login = model.login || null;
        this.password = model.password || null;
        this.name = model.name || null;
        this.admin = model.admin || null;
    }
}