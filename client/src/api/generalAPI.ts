import $api, { apiRequest, BASE_URL } from '.';
import { DCurrencyDTO, DCurrencyArraySchema } from './DTO/DB/DCurrency';
import { DTeamArraySchema, DTeamDTO } from './DTO/DB/DTeam';
import { RequestDepositDTO } from './DTO/Request/RequestDeposit';
import { DDepositArraySchema, DDepositDTO, DDepositSchema } from './DTO/DB/DDeposit';
import { DUserDTO, DUserSchema } from './DTO/DB/DUser';
import { RequestLoginDTO } from './DTO/Request/RequestLogin';

export const fetchTeams = async () => {
    return apiRequest<DTeamDTO[]>(() => $api.get(`${BASE_URL}/admin/team`), DTeamArraySchema);
};

export const fetchCurrencies = async () => {
    return apiRequest<DCurrencyDTO[]>(() => $api.get(`${BASE_URL}/admin/currency`), DCurrencyArraySchema);
}

export const createDeposit = async (deposit: RequestDepositDTO) => {
    return apiRequest<DDepositDTO>(() => $api.post(`${BASE_URL}/admin/deposit`, deposit), DDepositSchema);
}

export const fetchDeposits = async () => {
    return apiRequest<DDepositDTO[]>(() => $api.get(`${BASE_URL}/admin/deposit`), DDepositArraySchema);
}

export const fetchUser = async () => {
    return apiRequest<DUserDTO>(() => $api.get(`${BASE_URL}/user`), DUserSchema);
}

export const login = async (dto: RequestLoginDTO) => {
    return apiRequest<DUserDTO>(() => $api.post(`${BASE_URL}/user/login`, dto), DUserSchema);
}

export const logout = async () => {
    return apiRequest<null>(() => $api.post(`${BASE_URL}/user/logout`));
}