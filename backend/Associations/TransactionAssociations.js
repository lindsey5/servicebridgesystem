import AvailableDate from '../models/available-date.js';
import Transaction from '../models/transaction.js';
import ReviewedTransaction from '../models/reviewed-transaction.js';
import Client from '../models/client-account.js';
import Cancelled_transaction from '../models/cancelled_transaction.js';
import Payment from '../models/payment.js';

// Relationship between ReviewedTransaction and Transaction
// A ReviewedTransaction has one corresponding Transaction
ReviewedTransaction.hasOne(Transaction, {
  foreignKey: 'transaction_id',  // The foreign key in Transaction referring to the reviewed transaction
  sourceKey: 'transaction_id',   // The key in ReviewedTransaction that is referenced by the foreign key
  onDelete: 'CASCADE',           // If a reviewed transaction is deleted, the related transaction is also deleted
  onUpdate: 'CASCADE',           // Updates cascade to the related transaction
});

// The inverse relationship: A Transaction belongs to one ReviewedTransaction
Transaction.belongsTo(ReviewedTransaction, {
  foreignKey: 'transaction_id',  // The foreign key in Transaction referring to the reviewed transaction
  targetKey: 'transaction_id',   // The primary key in ReviewedTransaction
  onDelete: 'CASCADE',           // If a reviewed transaction is deleted, the related transaction is deleted
  onUpdate: 'CASCADE',           // Updates cascade to the related transaction
});

// Relationship between Client and Transaction
// A Client can have multiple transactions, so it's a one-to-many relationship
Client.hasMany(Transaction, {
  foreignKey: 'client',          // The foreign key in Transaction referring to the client
  sourceKey: 'id',               // The key in Client that is referenced by the foreign key
  onDelete: 'CASCADE',           // If a client is deleted, all their transactions are also deleted
  onUpdate: 'CASCADE',           // Updates cascade to related transactions
});

// A Transaction belongs to a Client
Transaction.belongsTo(Client, {
  foreignKey: 'client',          // The foreign key in Transaction referring to the client
  targetKey: 'id',               // The primary key in Client
  onDelete: 'CASCADE',           // If a client is deleted, the transaction is deleted
  onUpdate: 'CASCADE',           // Updates cascade to the transaction
});

// Relationship between AvailableDate and Transaction
// An AvailableDate can have multiple transactions (e.g., many transactions scheduled for a specific date)
AvailableDate.hasMany(Transaction, {
  foreignKey: 'date_id',         // The foreign key in Transaction referring to the available date
  sourceKey: 'date_id',          // The key in AvailableDate that is referenced by the foreign key
  onDelete: 'CASCADE',           // If an available date is deleted, the related transactions are also deleted
  onUpdate: 'CASCADE',           // Updates cascade to related transactions
});

// A Transaction belongs to one AvailableDate
Transaction.belongsTo(AvailableDate, {
  foreignKey: 'date_id',         // The foreign key in Transaction referring to the available date
  targetKey: 'date_id',          // The primary key in AvailableDate
  onDelete: 'CASCADE',           // If an available date is deleted, the related transactions are deleted
  onUpdate: 'CASCADE',           // Updates cascade to the transaction
});

Cancelled_transaction.hasOne(Transaction, {
  foreignKey: 'transaction_id',  // The foreign key in Transaction referring to the cancelled transaction
  sourceKey: 'transaction_id',   // The key in CancelledTransaction that is referenced by the foreign key
  onDelete: 'CASCADE',           // If a cancelled transaction is deleted, the related transaction is also deleted
  onUpdate: 'CASCADE',           // Updates cascade to the related transaction
})

Transaction.belongsTo(Cancelled_transaction, {
  foreignKey: 'transaction_id',  // The foreign key in Transaction referring to the cancelled transaction
  targetKey: 'transaction_id',   // The primary key in CancelledTransaction
  onDelete: 'CASCADE',           // If a cancelled transaction is deleted, the related transaction is deleted
  onUpdate: 'CASCADE',           // Updates cascade to the related transaction
})

Payment.hasOne(Transaction, {
  foreignKey: 'transaction_id',  
  sourceKey: 'transaction_id',   
  onDelete: 'CASCADE',        
  onUpdate: 'CASCADE'
})

Transaction.belongsTo(Payment, {
  foreignKey: 'transaction_id', 
  targetKey: 'transaction_id', 
  onDelete: 'CASCADE',         
  onUpdate: 'CASCADE', 
})