import Provider from '../../models/provider-account.js';
import ProviderServiceOffered from '../../models/service_offered.js';
import AvailableDate from '../../models/available-date.js';
import { Op, where } from 'sequelize';
import { sequelize } from '../../config/connection.js';
import AvailableDateService from '../../models/available_dates_services.js';

// This function get the client details from the databased based on the client id
const get_provider = async (req, res) => {
    try {
        const provider_id = req.userId// Retrieve the userId from the req object and assign it to the provider_id variable
        const provider = await Provider.findOne({ where: { id: provider_id } }); // Verify if a provider exists using the provider_id variable
        if(provider){
             // Execute if the provider is found using the provider_id variable
            const { password, ...providerWithoutPassword } = provider.toJSON(); // Exclude the password from the provider object
            res.status(200).json(providerWithoutPassword); // Respond with the provider data
        }else{
            res.status(404).json({ error: 'Provider not found' }); // Respond an error message if the client is not found 
        }

    } catch (err) {
        // Handle any errors that occur during the process
        res.status(400).json({ error: err.message });
    }
};

const searchProviders = async (req, res) => {
    const {service_name, price: priceStr, sortBy, location } = req.body;
    const price = parseFloat(priceStr);
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const offset = (page - 1) * limit;
    console.log(location)
    try {
        const query = {
            attributes: ['id', 'firstname', 'lastname', 'rating', 'profile_pic', 'bio', 'location'],
            where: { 
                location: {[Op.like] : `%${location}%`}
            },
            include: [
                { 
                    model: ProviderServiceOffered, 
                    where: { service_name, price: {  [Op.ne] : 0 } }, 
                    attributes: ['service_name', 'price'],
                    include: {
                        model: AvailableDateService,
                        attributes: [],
                        where: {
                            service_id: sequelize.col('ProviderServiceOffereds.service_id')
                        }
                    }
                },
                { 
                    model: AvailableDate, 
                    where: { date: {[Op.gte]: new Date() } },
                    include: {
                        model: AvailableDateService,
                        attributes: [],
                        where: {
                            date_id: sequelize.col('available_dates.date_id')
                        }
                    } },
            
            ],
            group: ['id', 'firstname', 'lastname', 'rating', 'profile_pic', 'bio', 'location']
        }

        if (price > 0) {
            query.include[0].where.price = {
                [Op.and]: [
                    { [Op.ne]: 0 },
                    { [Op.lte]: price }
                ]
            };
        }

        if(sortBy){
            sortBy[0] === 'price' ? query.order = [[{ model: ProviderServiceOffered}, sortBy[0], sortBy[1]]] : 
            query.order = [['rating', 'DESC']];
        }

        // Get to total rows
        const totalRecords = await Provider.count(query);
        // Calculate total pages
        const totalPages = calculateTotalPages(totalRecords[0].count, limit);

        query.limit = limit;
        query.offset = offset
        const searchResults = await Provider.findAll(query);

        if (!searchResults || searchResults.length === 0) {
            res.status(404).json({ message: 'No records found' });
        } else {
            // Convert each instance to plain JSON
            const result = searchResults.map(provider => provider.toJSON());
            const providers = result.map(provider => {
                const {service_name, price} = provider.ProviderServiceOffereds[0];
                
                return {
                    id: provider.id,
                    firstname: provider.firstname,
                    lastname: provider.lastname,
                    rating: provider.rating,
                    profile_pic: provider.profile_pic,
                    bio: provider.bio,
                    location: provider.location,
                    service_name,
                    price
                };
            });
        
            res.status(200).json({
                providers: providers,
                totalPages: totalPages,
                currentPage: page
            });
        }
        
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: 'Error fetching data' });
    }
}

function calculateTotalPages(totalRecords, limit){
    return Math.ceil(totalRecords / limit);
}


const update_provider = async (req, res) => {
    const { id, ...data } = req.body.data;
    try{
        const provider = await Provider.findByPk(id);
        if(provider){
            const updatedProvider = await provider.update(data);
            res.status(200).json(updatedProvider);
        }
    }catch(err){
        if(err.name === 'SequelizeUniqueConstraintError'){
            err.message = 'Username Already used';
        }
        res.status(400).json({error: err.message}); // Send an error response
    }
}

const get_provider_rating = async (req, res) => {
    try{
        const id = req.params.id;
        const provider_rating = await Provider.findOne({
            where: {
                id
            },
            attributes: ['rating']
        })
        if(provider_rating){
            res.status(200).json(provider_rating);
        }else{
            throw new Error('Provider not found');
        }
    }catch(err){
        console.log(err);
        res.status(400).json({error: err.message});
    }
}

const get_providers_count = async (req,res) => {
    try{
        const providers_count = await Provider.count();

        res.status(200).json({providers_count});
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

export default { 
    get_provider, 
    searchProviders, 
    update_provider, 
    get_provider_rating,
    get_providers_count
};