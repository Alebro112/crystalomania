import { sequelize, DataTypes } from "#config/db";

const User = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    indexes: []
});


// Event.hasMany(EventUser, { foreignKey: 'event', as: 'users', onDelete: 'CASCADE', allowNull: false, primaryKey: true });
// User.hasMany(EventUser, { foreignKey: 'user', as: 'events', onDelete: 'CASCADE', allowNull: false, primaryKey: true });

export default User