import Provider from '../../models/provider-account.js';
import ProviderServiceOffered from '../../models/service_offered.js';
import AvailableDate from '../../models/available-date.js';
import { Op } from 'sequelize';

// This function get the client details from the databased based on the client id
const get_provider = async (req, res) => {
    try {
        const provider_id = req.userId; // Retrieve the userId from the req object and assign it to the provider_id variable
        const provider = await Provider.findOne({ where: { id: provider_id } }); // Verify if a client exists using the provider_id variable
        if(provider){
             // Execute if the provider is found using the provider_id variable
            const { password, ...providerWithoutPassword } = provider.toJSON(); // Exclude the password from the provider object
            res.status(200).json({ provider: providerWithoutPassword }); // Respond with the provider data
        }else{
            res.status(404).json({ error: 'Provider not found' }); // Respond an error message if the client is not found 
        }

    } catch (err) {
        // Handle any errors that occur during the process
        res.status(400).json({ error: err.message });
    }
};

// This function retrieve the provider's fullname
const get_provider_name = async (req, res) => {
    const provider_id = req.params.id; // Retrieve the provider ID from the request parameters
    try{
        const provider = await Provider.findOne({ where: { id: provider_id }}); // Verify if the provider is exist from the database using the provider_id variable
        if(provider){
            // Execute if the provider is found from the database
            const fullname = provider.firstname + ' ' + provider.lastname; // Concat the firstname and lastname of the provider
            res.status(200).json({ fullname });  // Respond with the client's fullname
        }else{
            res.status(400).json({error: 'Provider not found'}); // Respond an error message if the provider is not found
        }
    }catch(err){
         // Handle any errors that occur during the process
        res.status(400).json({ error: err.message });
    }
}

const getProviders = async (req, res) => {
    const {service_name, price: priceStr, sortBy } = req.body;
    const price = parseFloat(priceStr);
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const offset = (page - 1) * limit;

    try {
        const query = {
            attributes: ['id', 'firstname', 'lastname', 'rating', 'profile_pic', 'bio', 'city'],
            include: [
                { 
                    model: ProviderServiceOffered, 
                    where: { service_name, price: {  [Op.ne] : 0 } }, 
                    attributes: ['service_name', 'price'] 
                },
                { model: AvailableDate, where: { date: {[Op.gte]: new Date() } } }
            ]
        }

        if(price > 0){
            query.include[0].where.price = { [Op.lt] : price };
        }

        if(sortBy){
            sortBy[0] === 'price' ? query.order = [[{ model: ProviderServiceOffered}, sortBy[0], sortBy[1]]] : 
            query.order = [['rating', 'DESC']];
        }

        // Get to total rows
        const totalRecords = await Provider.count(query);
        // Calculate total pages
        const totalPages = calculateTotalPages(totalRecords, limit);

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
                    city: provider.city,
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
        console.error('Error fetching data:', err);
        res.status(400).json({ error: 'Error fetching data' });
    }
}

function calculateTotalPages(totalRecords, limit){
    return Math.ceil(totalRecords / limit);
}


export default { get_provider, get_provider_name, getProviders};