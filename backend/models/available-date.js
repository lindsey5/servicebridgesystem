import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const AvailableDate = sequelize.define('available_date', {
    date_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    provider_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    }
}, {
    timestamps: false,
    tableName: 'provider_available_dates'
});


export default AvailableDate;
