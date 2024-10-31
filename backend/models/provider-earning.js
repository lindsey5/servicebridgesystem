import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const ProviderEarning = sequelize.define('ProviderEarning',{
  transaction_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  earnings: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  payment_date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'provider_earnings',
  timestamps: false,
});

export default ProviderEarning;