import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const Cancelled_transaction = sequelize.define('Cancelled_Transaction', {
    transaction_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    cancelled_by: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    cancellation_reason:{
        type: DataTypes.STRING,
        allowNull: false
    },
    canceller:{
        type: DataTypes.STRING,
        allowNull: false
    },
    cancelled_date: {
        type: DataTypes.DATEONLY
    }
    }, { timestamps: false, tableName: 'cancelled_transactions' }
);

export default Cancelled_transaction;