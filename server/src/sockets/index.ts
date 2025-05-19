import { Server } from 'socket.io';
import { getIO } from './io';
import { teamService } from '#controllers/team';
import logger from '#config/logger';
import { currencyService } from '#controllers/currency';
import { Request } from 'express';
import ApiError from '#middlewares/exceptions/api.error';

export function registerSocketHandlers(io: Server) {
    // io.use((socket, next) => {
    //     const req = socket.request as Request;

    //     //@ts-ignore
    //     if (req.session?.passport?.user) {
    //         return next();
    //     }

    //     return next(ApiError.UnauthorizedError());
    // });

    io.on('connection', (socket) => {
        console.log('🔌 A user connected:', socket.id);


        socket.on('disconnect', () => {
            console.log('❌ User disconnected:', socket.id);
        });

        // тут добавляй кастомные события socket.on(...)
    });
}

export async function updateDashboard() {
    const io = getIO();

    const [teams, teamsError] = await teamService.getAllTeams(logger);
    const [currencies, currenciesError] =
        await currencyService.getAllCurrencies(logger);

    if (teamsError || currenciesError) {
        return;
    }

    io.emit('dashboard:update', { teams, currencies });
}
