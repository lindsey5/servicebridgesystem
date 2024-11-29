import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const AvailableTime = sequelize.define('AvailableTime', {
    date_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    time_slot: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: 'available_time'
});

export default AvailableTime;
