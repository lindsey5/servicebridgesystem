import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const ProviderServiceOffered = sequelize.define('ProviderServiceOffered', {
    service_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    service_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Service Name cannot be empty'
            },
            maxLength(value) {
                if (value.length > 30) {
                    throw new Error('Service Name cannot be more than 30 characters long.');
                }
            }
        }
    }, 
    provider_id: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Provider ID cannot be empty'
            },
        }
    },
    price: {
        type: DataTypes.INTEGER,
    },
    }, {
    timestamps: false,
    tableName: 'provider_services_offered'
}

);


export default ProviderServiceOffered;