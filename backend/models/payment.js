import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const Payment = sequelize.define('Payment', {
    transaction_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Transaction ID cannot be empty'
            },
            maxLength(value) {
                if (value.length > 255) {
                    throw new Error('Transaction ID cannot be more than 36 characters long.');
                }
            }
        }
    },
    payment_intent_id: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Payment Intent ID cannot be empty'
            },
            maxLength(value) {
                if (value.length > 255) {
                    throw new Error('Payment Intent ID cannot be more than 255 characters long.');
                }
            }
        }
    },
    client_key: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Client Key cannot be empty'
            },
            maxLength(value) {
                if (value.length > 255) {
                    throw new Error('Client Key cannot be more than 255 characters long.');
                }
            }
        }
    },
    payment_method_id: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Payment Method ID cannot be empty'
            },
            maxLength(value) {
                if (value.length > 255) {
                    throw new Error('Payment Method ID cannot be more than 255 characters long.');
                }
            }
        }
    }
    }, { timestamps: false, }
);

export default Payment;