import dotenv from 'dotenv';
dotenv.config();

import { Sequelize, DataTypes } from 'sequelize';

const POSTGRES_URL = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public`;
export const sequelize = new Sequelize(POSTGRES_URL, {
    logging: false,
    define: {
        underscored: true,
    },
    pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

export async function connectDB() {
    try {
        await sequelize.authenticate();
    } catch (error) {
        console.error('Unable to connect to database: ', error);
    }
}

export { Sequelize, DataTypes };
