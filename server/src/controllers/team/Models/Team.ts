import { sequelize, DataTypes } from '#config/db';

import { Deposit } from '#controllers/deposit';

const Team = sequelize.define(
    'teams',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        indexes: [],
    },
);

// Event.hasMany(EventUser, { foreignKey: 'event', as: 'users', onDelete: 'CASCADE', allowNull: false, primaryKey: true });
// User.hasMany(EventUser, { foreignKey: 'user', as: 'events', onDelete: 'CASCADE', allowNull: false, primaryKey: true });

Team.hasMany(Deposit, {
    foreignKey: 'team_id',
    as: 'deposits',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Deposit.belongsTo(Team, {
    foreignKey: 'team_id',
    as: 'team',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

export default Team;
