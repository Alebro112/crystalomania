import { sequelize, connectDB } from '#config/db';

import { Currency } from '#controllers/currency';
import { Team } from '#controllers/team';
import {
    DepositStatus,
    Deposit,
    depositService,
    RequestDepositDTO,
} from '#controllers/deposit';
import logger from './logger';
import { Transaction } from 'sequelize';
import { RequestUserDTO, userService } from '#controllers/user';

const resetDatabase = async () => {
    try {
        console.log('Starting database reset...');

        await connectDB();
        sequelize.sync({ force: true }).then(async () => {
            await Currency.bulkCreate([
                {
                    name: 'orange',
                    title: 'Оранжевые кристалы',
                    base_value: 10,
                    total: 1,
                },
                {
                    name: 'green',
                    title: 'Зеленые кристалы',
                    base_value: 10,
                    total: 1,
                },
                {
                    name: 'pink',
                    title: 'Розовые кристалы',
                    base_value: 10,
                    total: 1,
                },
                {
                    name: 'red',
                    title: 'Красные кристалы',
                    base_value: 10,
                    total: 1,
                },
                {
                    name: 'black',
                    title: 'Чёрные кристалы',
                    base_value: 10,
                    total: 1,
                },
                {
                    name: 'white',
                    title: 'Белые кристалы',
                    base_value: 10,
                    total: 1,
                },
            ]);

            await Team.bulkCreate([
                {
                    title: 'Команда 1',
                    color: 'turmeric', // orange
                },
                {
                    title: 'Команда 2',
                    color: 'blackish-green',
                },
                {
                    title: 'Команда 3',
                    color: 'claret', // red
                },
                {
                    title: 'Команда 4',
                    color: 'royal-blue',
                },
                {
                    title: 'Команда 5',
                    color: 'zhang-qinq', // dark blue
                },
            ]);

            await DepositStatus.bulkCreate([
                {
                    id: 100,
                    name: 'COMPLETED',
                },
                {
                    id: 200,
                    name: 'ROLLBACKED',
                },
            ]);

            const transaction = await sequelize.transaction();

            // await depositService.makeRandomDeposits(50, logger, transaction);

            await transaction.commit();

            await userService.createUser(
                {
                    login: 'Alebro',
                    password: '123456qwerty',
                    name: 'Vsevolod Boltov',
                    admin: true,
                } as RequestUserDTO,
                logger,
            );

            await userService.createUser(
                {
                    login: 'Bankir1',
                    password: 'bankir12356',
                    name: 'Bankir One',
                } as RequestUserDTO,
                logger,
            );

            await userService.createUser(
                {
                    login: 'Bankir2',
                    password: 'bankir23456',
                    name: 'Bankir Two',
                } as RequestUserDTO,
                logger,
            );

            await userService.createUser(
                {
                    login: 'Bankir3',
                    password: 'bankir34567',
                    name: 'Bankir Three',
                } as RequestUserDTO,
                logger,
            );

            await userService.createUser(
                {
                    login: 'Bankir4',
                    password: 'bankir45678',
                    name: 'Bankir Four',
                } as RequestUserDTO,
                logger,
            );

            await userService.createUser(
                {
                    login: 'Bankir5',
                    password: 'bankir56789',
                    name: 'Bankir Five',
                } as RequestUserDTO,
                logger,
            );
        });
    } catch (error) {
        console.error('Error during database reset:', error);
    }
};

resetDatabase();
