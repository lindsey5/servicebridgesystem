import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js'

const AvailableDateService = sequelize.define('AvailableDateServices', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true   
    },
    date_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    service_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'available_date_services'
});

export default AvailableDateService;
