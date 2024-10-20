import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

class ProviderEarning extends Model {}

ProviderEarning.init({
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
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'ProviderEarning',
  tableName: 'provider_earnings',
  timestamps: false,
});

export default ProviderEarning;