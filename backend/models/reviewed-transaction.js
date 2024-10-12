import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const ReviewedTransaction = sequelize.define('ReviewedTransaction', {
    transaction_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    review: {
        type: DataTypes.STRING,
        allowNull: true
    },
    date_reviewed:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'reviewed_transactions',
    timestamps: false,
  }
);

export default ReviewedTransaction;