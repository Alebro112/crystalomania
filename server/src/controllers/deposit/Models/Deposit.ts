import { sequelize, DataTypes } from "#config/db";

const Deposit = sequelize.define("deposits", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    details: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'deposit_statuses',
            key: 'id'
        }
    },
    team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'teams',
            key: 'id'
        }
    }
}, {
    indexes: []
});


// Event.hasMany(EventUser, { foreignKey: 'event', as: 'users', onDelete: 'CASCADE', allowNull: false, primaryKey: true });
// User.hasMany(EventUser, { foreignKey: 'user', as: 'events', onDelete: 'CASCADE', allowNull: false, primaryKey: true });

export default Deposit