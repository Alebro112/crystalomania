import { sequelize, DataTypes } from '#config/db';

import Deposit from './Deposit';

const DepositStatus = sequelize.define(
    'deposit_statuses',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        indexes: [],
    },
);

DepositStatus.hasMany(Deposit, {
    foreignKey: 'status_id',
    as: 'deposits',
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
});

Deposit.belongsTo(DepositStatus, {
    foreignKey: 'status_id',
    as: 'status',
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
});

export default DepositStatus;
