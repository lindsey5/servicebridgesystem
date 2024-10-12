import Transaction from '../models/transaction.js';
import CompanyEarning from '../models/company-earning.js';
import ProviderEarning from '../models/provider-earning.js';

// Define relationship between ProviderEarning and Transaction
// A ProviderEarning record can have one associated Transaction
ProviderEarning.hasOne(Transaction, {
  foreignKey: 'transaction_id', // Specifies the foreign key in the Transaction model
  sourceKey: 'transaction_id',  // Links the source key from the ProviderEarning model
  onDelete: 'CASCADE',          // If a ProviderEarning is deleted, its associated Transaction is deleted as well
  onUpdate: 'CASCADE',          // Updates are cascaded from ProviderEarning to the associated Transaction
});

// Define the inverse relationship where a Transaction belongs to a ProviderEarning
Transaction.belongsTo(ProviderEarning, {
  foreignKey: 'transaction_id', // Specifies the foreign key in the Transaction model
  targetKey: 'transaction_id',  // Links to the target key in the ProviderEarning model
  onDelete: 'CASCADE',          // If the ProviderEarning is deleted, the associated Transaction is deleted
  onUpdate: 'CASCADE',          // Updates are cascaded from Transaction to ProviderEarning
});

// Define relationship between CompanyEarning and Transaction
// A CompanyEarning record can have one associated Transaction
CompanyEarning.hasOne(Transaction, {
  foreignKey: 'transaction_id', // Specifies the foreign key in the Transaction model
  sourceKey: 'transaction_id',  // Links the source key from the CompanyEarning model
  onDelete: 'CASCADE',          // If a CompanyEarning is deleted, its associated Transaction is deleted
  onUpdate: 'CASCADE',          // Updates are cascaded from CompanyEarning to the associated Transaction
});

// Define the inverse relationship where a Transaction belongs to a CompanyEarning
Transaction.belongsTo(CompanyEarning, {
  foreignKey: 'transaction_id', // Specifies the foreign key in the Transaction model
  targetKey: 'transaction_id',  // Links to the target key in the CompanyEarning model
  onDelete: 'CASCADE',          // If the CompanyEarning is deleted, the associated Transaction is deleted
  onUpdate: 'CASCADE',          // Updates are cascaded from Transaction to CompanyEarning
});
