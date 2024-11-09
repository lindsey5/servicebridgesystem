import AvailableDate from "../models/available-date.js";
import AvailableDateService from "../models/available_dates_services.js";
import ProviderServiceOffered from "../models/service_offered.js";

ProviderServiceOffered.hasMany(AvailableDateService, {
    foreignKey: 'service_id', 
    sourceKey: 'service_id', 
    onDelete: 'CASCADE',         
    onUpdate: 'CASCADE', 
})

AvailableDateService.belongsTo(ProviderServiceOffered,{
    foreignKey: 'service_id', 
    targetKey: 'service_id', 
    onDelete: 'CASCADE',         
    onUpdate: 'CASCADE', 
})

AvailableDate.hasMany(AvailableDateService, {
    foreignKey: 'date_id', 
    sourceKey: 'date_id', 
    onDelete: 'CASCADE',         
    onUpdate: 'CASCADE', 
})

AvailableDateService.belongsTo(AvailableDate,{
    foreignKey: 'date_id', 
    targetKey: 'date_id', 
    onDelete: 'CASCADE',         
    onUpdate: 'CASCADE', 
})