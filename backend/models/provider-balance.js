import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const ProviderBalance = sequelize.define('ProviderBalance', {
    provider_id: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Provider ID cannot be empty'
            },
        }
    },
    balance: {
        type: DataTypes.DOUBLE,
    },
    }, {
    timestamps: false,
    tableName: 'provider_balance'
}

);


export default ProviderBalance;