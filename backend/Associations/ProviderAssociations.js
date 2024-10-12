import Transaction from '../models/transaction.js';
import Provider from '../models/provider-account.js';
import ProviderServiceOffered from '../models/service_offered.js';
import AvailableDate from '../models/available-date.js';

// Relationship between Provider and ProviderServiceOffered
// A Provider can offer multiple services, hence has a one-to-many relationship with ProviderServiceOffered
Provider.hasMany(ProviderServiceOffered, {
  foreignKey: 'provider_id',   // The foreign key in ProviderServiceOffered that refers to Provider
  sourceKey: 'id',             // The key in Provider that is referenced by the foreign key
  onDelete: 'CASCADE',         // If a Provider is deleted, all associated services are also deleted
  onUpdate: 'CASCADE',         // If a Provider's ID is updated, this change cascades to the services
});

// The inverse relationship: A ProviderServiceOffered belongs to one Provider
ProviderServiceOffered.belongsTo(Provider, {
  foreignKey: 'provider_id',   // The foreign key in ProviderServiceOffered referring to Provider
  targetKey: 'id',             // The primary key in Provider
  onDelete: 'CASCADE',         // If a Provider is deleted, the associated services are deleted
  onUpdate: 'CASCADE',         // Updates to the Provider will cascade to the associated services
});

// Relationship between Provider and Transaction
// A Provider can have multiple transactions, establishing a one-to-many relationship
Provider.hasMany(Transaction, {
  foreignKey: 'provider',      // The foreign key in Transaction that refers to Provider
  sourceKey: 'id',             // The key in Provider that is referenced by the foreign key
  onDelete: 'CASCADE',         // If a Provider is deleted, all associated transactions are also deleted
  onUpdate: 'CASCADE',         // If a Provider's ID is updated, the changes cascade to transactions
});

// The inverse relationship: A Transaction belongs to one Provider
Transaction.belongsTo(Provider, {
  foreignKey: 'provider',      // The foreign key in Transaction referring to Provider
  targetKey: 'id',             // The primary key in Provider
  onDelete: 'CASCADE',         // If a Provider is deleted, the associated transaction is deleted
  onUpdate: 'CASCADE',         // Updates to the Provider will cascade to the associated transactions
});

// Relationship between Provider and AvailableDate
// A Provider can have multiple available dates, creating a one-to-many relationship
Provider.hasMany(AvailableDate, {
  foreignKey: 'provider_id',   // The foreign key in AvailableDate referring to Provider
  sourceKey: 'id',             // The key in Provider referenced by the foreign key
  onDelete: 'CASCADE',         // If a Provider is deleted, all associated available dates are also deleted
  onUpdate: 'CASCADE',         // If a Provider's ID is updated, the changes cascade to available dates
});

// The inverse relationship: An AvailableDate belongs to one Provider
AvailableDate.belongsTo(Provider, {
  foreignKey: 'provider_id',   // The foreign key in AvailableDate referring to Provider
  targetKey: 'id',             // The primary key in Provider
  onDelete: 'CASCADE',         // If a Provider is deleted, the associated available dates are deleted
  onUpdate: 'CASCADE',         // Updates to the Provider will cascade to the associated available dates
});
