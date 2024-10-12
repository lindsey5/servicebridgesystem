import Available_date from '../../models/available-date.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

// Function to get the JWT token from the browser.
const getJwtToken = (req) =>{
    try {
        const token = req.cookies.jwt; // Retrieve the JWT token from the browser.
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Decode the JWT token
        return decodedToken.id; // Return the decoded token
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(401).json({ error: 'Unauthorized or invalid token' }); // Respond an unauthorized error message
    }
}

// Get all the available date of provider
const get_available_dates = async (req, res) => {
    let provider_id;
    const today = new Date(); // Get the current date

    /* Set the provider_id based on the query if it is present in the request parameters.
        This indicates that the request originated from the client page.*/
    if (req.query && req.query.provider_id) {
        provider_id = req.query.provider_id;
    } else {
        provider_id = getJwtToken(req); // Assign the jwt token to provider_id
    } 

    // Define options for querying the database, including filtering by provider_id and ordering by date in ascending order
    const queryOptions = {
        where: { provider_id: provider_id },
        order: [['date', 'ASC']]
    };

    if (req.query.isFiltered === 'true') {
            queryOptions.where.date = { [Op.gte]: today } 
    }

    try {
        // Retrieve available dates from the database based on the specified options.
        const available_dates = await Available_date.findAll(queryOptions);

        if (available_dates && available_dates.length > 0) {
            return res.status(200).json(available_dates); /* Respond with the available dates 
                                                            if any matching results were found based on the 
                                                            specified options*/
        } else {
            return res.status(404).json({ error: 'No available dates found' }); // Respond a message if there's no result
        }
    } catch (err) {
        console.log(err);
        // Handle any errors that occur during the process
        return res.status(400).json({ error: err.message }); // Respond an error message
    }
};

// Function to get the available date of the provider
const get_available_date = async (req, res) => {
    const date = req.query.date; // Retrieve the date from the query parameters
    try{
        const provider_id = req.userId; /// Assign the userId from the request object to the provider_id variable.

        // Retrieve available date from the database
        const available_date = await Available_date.findOne({
            where: { 
                provider_id: provider_id,
                date: date
            }
        });

        if(available_date){
            res.status(200).json({available_date}); // Respond with available date if any result found
        }else{
            res.status(404).json({ message: 'No records found' });  // Respond a message if there's no result
        }
    }catch(err){
        console.log(err);
        // Handle any errors that occur during the process
        res.status(400).json({ error: err.message }); // Respond an error message
    }
}

// Function to get the date id of the available date of the provider
const get_date_id = async (req, res) => {
    try{
        const { provider_id, date } = req.query; // Destructure the 'provider_id' and 'date' from the query parameters
        const formattedDate = formatDate(date); // Format the retrieved date from the query parameters
        
        // Retrieve available date from the database
        const available_date = await Available_date.findOne({
            attributes: ['date_id'],
            where: {
                provider_id: provider_id,
                date: formattedDate
            }
        });
        if(available_date){
            const date_id = available_date.date_id; // Respond with available date id if  any result found
            res.status(200).json({date_id});
        }else{
            res.status(404).json({ message: 'No records found' }); // Respond a message if there's no result
        }
    }catch(err){ 
        // Handle any errors that occur during the process
        res.status(400).json({ error: err.message }); // Respond an error message
    }
}


// This function formats the date. For instance, if the input date string is "2024-10-06T10:20:30Z", it returns "2024-10-06".
function formatDate(dateString) {
    const date = new Date(dateString); // Create a new Date object from the provided date string.
    const year = date.getFullYear(); // Extract the full year (YYYY) from the Date object.
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Extract the month (0-11), add 1 to make it (1-12), convert to string, and pad with leading zero if needed.
    const day = String(date.getDate()).padStart(2, '0'); // Extract the day of the month, convert to string, and pad with leading zero if needed.
    
    return `${year}-${month}-${day}`; // Return the formatted date string in YYYY-MM-DD format.
    
}

// This function adds a new available date for the provider.
const create_available_date = async (req, res) => {
    const { date } = req.body; // Destructure the 'date' property from the request body.
    try{
        const provider_id = req.userId; // Assign the userId from the request object to the provider_id variable.
        const available_date = await Available_date.create({ date, provider_id}); // Create new available date for the provider in database 
        res.status(201).json(available_date); // Respond the new available date for the provider
    }catch(err){
        // Handle any errors that occur during the process
        res.status(400).json({ error: err.message }); // Respond an error message
    }
}

// This function get the date based on the date id
const get_date = async (req, res) => {
    const date_id = req.params.id; // Retrieve the date_id from the query parameters 
    try{
        const date = await Available_date.findOne({ where: { date_id }}); // Find the date_id in the database
        res.status(200).json(date.date); // Respond the date found from the database
    }catch(err){
        // Handle any errors that occur during the process
        res.status(400).json({ error: err.message }); // Respond an error message
    }
}

export default {
    get_available_dates,
    get_available_date,
    create_available_date,
    get_date_id,
    get_date,
};