import { sequelize, DataTypes } from "#config/db";

import { Deposit } from "#controllers/deposit";

const Currency = sequelize.define("currencies", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    base_value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 1
    },
    total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    indexes: []
});

export default Currency

/*
WITH stats AS (
  SELECT
    MIN(total)::float AS min_total,
    MAX(total)::float AS max_total,
	SUM(total)::float AS sum_total,
	AVG(total)::Float AS avg_total,
	COUNT(total)::float AS count_total
  FROM currencies
)
UPDATE currencies c
-- SET rate = (0.5 / ((c.total::float / s.avg_total) + 0.25)) - 0.2
SET rate = 2 - (c.total::float / s.avg_total)
FROM stats s; 

SELECT * FROM currencies

*/
