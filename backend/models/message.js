import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';
import { v4 as uuidv4 } from 'uuid';

const Message = sequelize.define('Message', {
    message_id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true
    },
    from_user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    to_user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW 
    }
}, {
    timestamps: false,
    tableName: 'messages'
});

export default Message;
