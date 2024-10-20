import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const Service = sequelize.define('Service', {
    service_name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Service Name cannot be empty'
            },
            maxLength(value) {
                if (value.length > 50) {
                    throw new Error('Service Name cannot be more than 50 characters long.');
                }
            }
        }
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Category Name cannot be empty'
            },
            maxLength(value) {
                if (value.length > 50) {
                    throw new Error('Service Name cannot be more than 50 characters long.');
                }
            }
        }
    }
    }, { timestamps: false, tableName: 'services' }
);

export default Service;