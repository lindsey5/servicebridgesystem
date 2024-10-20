import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const Payment = sequelize.define('Payment', {
    transaction_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Transaction ID cannot be empty'
            },
            maxLength(value) {
                if (value.length > 36) {
                    throw new Error('Transaction ID cannot be more than 36 characters long.');
                }
            }
        }
    },
    payment_checkout_id: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Payment Checkout ID cannot be empty'
            },
            maxLength(value) {
                if (value.length > 255) {
                    throw new Error('Payment Checkout ID cannot be more than 255 characters long.');
                }
            }
        }
    },
},
{ timestamps: false, tableName: 'payments' });

export default Payment;