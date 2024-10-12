import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const Category = sequelize.define('Category', {
    category_name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    icon: {
        type: DataTypes.BLOB,
        allowNull: false,
    }
    }, { timestamps: false, }
);

export default Category;