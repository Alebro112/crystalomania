import { sequelize, connectDB } from "#config/db"

import { Currency } from "#controllers/currency"
import { Team } from "#controllers/team";
import { DepositStatus, Deposit, depositService, RequestDepositDTO } from "#controllers/deposit";
import { userService } from "#controllers/user"
import logger from "./logger";
import { Transaction } from "sequelize";



const resetDatabase = async () => {
    try {
        console.log('Starting database reset...');

        await connectDB()
        sequelize.sync({ force: true }).then(async () => {
            await Currency.bulkCreate([{
                name: 'red',
                title: 'Красные кристалы',
                base_value: 10,
                total: 1,
            }, {
                name: 'blue',
                title: 'Синие кристалы',
                base_value: 10,
                total: 1,
            }, {
                name: 'green',
                title: 'Зеленые кристалы',
                base_value: 10,
                total: 1,
            }, {
                name: 'yellow',
                title: 'Желтые кристалы',
                base_value: 10,
                total: 1,
            }, {
                name: 'purple',
                title: 'Фиолетовые кристалы',
                base_value: 10,
                total: 1,
            }, {
                name: 'orange',
                title: 'Оранжевые кристалы',
                base_value: 10,
                total: 1,
            }])

            await Team.bulkCreate([{
                title: 'Команда 1',
                color: 'turmeric' // orange
            }, {
                title: 'Команда 2',
                color: 'blackish-green'
            }, {
                title: 'Команда 3',
                color: 'claret' // red
            }, {
                title: 'Команда 4',
                color: 'royal-blue'
            }, {
                title: 'Команда 5',
                color: 'zhang-qinq' // dark blue
            }])

            await DepositStatus.bulkCreate([{
                id: 100,
                name: 'COMPLETED'
            }, {
                id: 200,
                name: 'ROLLBACKED'
            }])

            const transaction = await sequelize.transaction();

            await depositService.makeRandomDeposits(50, logger, transaction);

            await transaction.commit();
        })
    } catch (error) {
        console.error('Error during database reset:', error);
    }
};

resetDatabase();
