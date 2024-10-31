import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const ProviderBalance = sequelize.define('ProviderBalance', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Provider ID cannot be empty'
            },
        }
    },
    balance: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    }, {
    timestamps: false,
    tableName: 'provider_balance'
}

);


export default ProviderBalance;