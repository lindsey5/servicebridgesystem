import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

class CompanyEarning extends Model {}

CompanyEarning.init({
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
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'CompanyEarning',
  tableName: 'company_earnings', 
  timestamps: false,
});

export default CompanyEarning;
