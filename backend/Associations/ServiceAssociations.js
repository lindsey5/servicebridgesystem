import ProviderServiceOffered from '../models/service_offered.js';
import Service from '../models/service.js';
import Category from '../models/category.js';

// Relationship between Service and ProviderServiceOffered
// A Service can be offered by multiple providers, hence a one-to-many relationship
Service.hasMany(ProviderServiceOffered, {
  foreignKey: 'service_name',   // The foreign key in ProviderServiceOffered that refers to the service
  sourceKey: 'service_name',    // The key in Service that is referenced by the foreign key
  onDelete: 'CASCADE',          // If a service is deleted, all related offers by providers are also deleted
  onUpdate: 'CASCADE',          // If a service is updated, the changes cascade to the offered services
});

// The inverse relationship: A ProviderServiceOffered belongs to one Service
ProviderServiceOffered.belongsTo(Service, {
  foreignKey: 'service_name',   // The foreign key in ProviderServiceOffered referring to the Service
  targetKey: 'service_name',    // The primary key in Service
  onDelete: 'CASCADE',          // If a Service is deleted, the related offers are deleted
  onUpdate: 'CASCADE',          // Updates to the Service will cascade to the related offers
});

// Relationship between Category and Service
// A Category can contain multiple services, establishing a one-to-many relationship
Category.hasMany(Service, {
  foreignKey: 'category_name',  // The foreign key in Service referring to Category
  sourceKey: 'category_name',   // The key in Category that is referenced by the foreign key
  onDelete: 'CASCADE',          // If a category is deleted, all related services are also deleted
  onUpdate: 'CASCADE',          // If a category is updated, the changes cascade to related services
});

// The inverse relationship: A Service belongs to one Category
Service.belongsTo(Category, {
  foreignKey: 'category_name',  // The foreign key in Service referring to Category
  targetKey: 'category_name',   // The primary key in Category
  onDelete: 'CASCADE',          // If a Category is deleted, the related services are deleted
  onUpdate: 'CASCADE',          // Updates to the Category will cascade to related services
});
