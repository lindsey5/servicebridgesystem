import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const Declined_transaction = sequelize.define('Declined_Transaction', {
    transaction_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    declined_by: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    decline_reason:{
        type: DataTypes.STRING,
        allowNull: false
    },
    declined_date: {
        type: DataTypes.DATEONLY
    }
    }, { timestamps: false, tableName: 'declined_transactions' }
);

export default Declined_transaction;