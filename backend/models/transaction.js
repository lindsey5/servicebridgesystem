import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';
import { v4 as uuidv4 } from 'uuid';

const Transaction = sequelize.define('transaction', {
    transaction_id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true
    },
    provider: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Provider id cannot be empty'
            },
            len: {
                args: [1, 36],
                msg: 'The maximum length of provider id is 36'
            }
        }
    },
    client: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Client id cannot be empty'
            },
            len: {
                args: [1, 36],
                msg: 'The maximum length of client id is 36'
            }
        }
    },
    service_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Service name cannot be empty'
            },
            len: {
                args: [1, 50],
                msg: 'The maximum length of service name is 50'
            }
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Address cannot be empty'
            },
            len: {
                args: [1, 100],
                msg: 'The maximum length of service name is 100'
            }
        }
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: {
                msg: 'Price must be a float value'
            }
        }
    },
    payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Payment method cannot be empty'
            },
            isIn: {
                args: [['Cash on Pay', 'Online Payment']],
                msg: 'Payment method should be Cash on Pay or Online Payment'
            }
        }
    },
    date_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Date id cannot be empty'
            },
            isInt: {
                msg: 'Date id should be an integer'
            }
        },
        references: {
            model: 'available_date', // Reference to the available_date table
            key: 'date_id'
        }
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Time cannot be empty'
            },
            len: {
                args: [1, 10],
                msg: 'Time maximum length is 10'
            }
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    booked_on: {
        type: DataTypes.DATE
    }
}, {
    timestamps: false
});

export default Transaction;
