import { fn, col, Op } from 'sequelize';
import ProviderEarning from '../../models/provider-earning.js';
import Transaction from '../../models/transaction.js';

// This function retrieves the provider's earnings for each month of the current year
const get_provider_earning_per_month = async (req, res) => {
    let provider_earnings_array  = []; // Initialize an array to hold monthly earnings
    const provider_id = req.userId; // Get the userId from the request object then assign to the provider_id variable
    const currentYear = new Date().getFullYear();
    try {
        const options = { 
            attributes: [
                // Calculate the total earnings of the provider for each month
                [fn('SUM', col('earnings')), 'total_earnings'], 
                [fn('MONTH', col('payment_date')), 'month']
            ],
            where: {
                payment_date: {
                    [Op.between]: [`${currentYear}-01-01`, `${currentYear}-12-31`] // Restrict the query to the current year
                }
            },
            // Include the Transaction model with a condition for the specific provider
            include: [{ 
                model: Transaction,
                where: { provider: provider_id }
            }],
            // Group the results by month of the payment date
            group: [fn('MONTH', col('payment_date'))]
        };
        
        const provider_earnings = await ProviderEarning.findAll(options); // Retrieve the earnings for each month
        // Populate the provider_earnings_array with total earnings indexed by month
        provider_earnings.forEach(earning => {
            // Assign the total earnings to the correct index in the array (0-11 for Jan-Dec)
            provider_earnings_array[earning.dataValues.month - 1] = earning.dataValues.total_earnings; 
        });

        // Respond with the array of monthly earnings
        res.status(200).json(provider_earnings_array);
    } catch (err) {
         // Handle any errors that occur during the process
        res.status(400).json({ error: err.message }); // Send an error response message
    }
}

// Gets the total earnings of the provider this day
const get_provider_today_earnings = async (req, res) => {
    const provider_id = req.userId; // Get the userId from the request object then assign to the provider_id variable
    try{
        // Retrieve the total of the provider's earning this day
        const todayEarnings = await ProviderEarning.findOne({
            attributes: [ 
                [fn('SUM', col('earnings')), 'total_earnings']
            ],
            where: { payment_date: { [Op.eq]: new Date() } }, 
            include: [{
                model: Transaction,
                where: { provider: provider_id }
            }]
        });

        res.status(200).json({ total_earnings: todayEarnings.dataValues.total_earnings }); // Respond with the provider's total earnings this day
    }catch(err){
         // Handle any errors that occur during the process
        res.status(400).json({error: err.message}); // Send an error response message
    }
}

const get_provider_earnings = async (req, res) => {
    try{
        const provider = req.userId;
        const total_earnings = await ProviderEarning.findAll({
            include: [{
                model: Transaction,
                where: { provider, payment_method: 'Online Payment' }
            }],
            order: [
                ['payment_date', 'DESC']
            ]
        })

        res.status(200).json(total_earnings);
    }catch(err){
        res.status(400).json({error: err.message})
    }
}

export default { get_provider_earning_per_month, get_provider_today_earnings, get_provider_earnings };