import { create } from 'zustand';
import * as generalAPI from '@/api/generalAPI';
import { DUserDTO } from '@/api/DTO/DB/DUser';
import { RequestLoginDTO } from '@/api/DTO/Request/RequestLogin';


interface UserState {
    user: DUserDTO | null;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setUser: (user: DUserDTO | null) => void;
    fetchUser: () => void;
    login: (user: RequestLoginDTO) => Promise<string | null>;
    logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    loading: true,
    setLoading: (loading: boolean) => set({ loading }),
    setUser: (user: DUserDTO | null) => set({ user }),
    fetchUser: async () => {
        const response = await generalAPI.fetchUser();
        if (response.success) {
            set({ user: response.data, loading: false });
        } else {
            set({ user: null, loading: false });
        }
    },
    login: async (dto: RequestLoginDTO) => {
        const response = await generalAPI.login(dto);
        if (response.success) {
            set({ user: response.data, loading: false });
            return null;
        } 

        return response.type === 'message' ? response.message : 'Неизвестная ошибка';
    },
    logout: async () => {
        const response = await generalAPI.logout();
        if (response.success) {
            set({ user: null, loading: false });
        }
    }
}))