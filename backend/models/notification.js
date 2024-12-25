import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const Notification = sequelize.define('notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    recipient_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sender_id:{
        type: String,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('unread', 'read'),
        defaultValue: 'unread'
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

export default Notification
