import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const Porfolio = sequelize.define('Porfolio', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    provider_id:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.BLOB,
        allowNull: false
    }
},
{ timestamps: false, tableName: 'portfolio' });

export default Porfolio;