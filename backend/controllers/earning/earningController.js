import { fn, col, Op, Sequelize, where } from 'sequelize';
import ProviderEarning from '../../models/provider-earning.js';
import Transaction from '../../models/transaction.js';
import AvailableDate from '../../models/available-date.js';
import CompanyEarning from '../../models/company-earning.js';

// This function retrieves the provider's earnings for each month of the current year
const get_provider_earning_per_month = async (req, res) => {
    let provider_earnings_array  = []; // Initialize an array to hold monthly earnings
    const provider_id = req.userId; // Get the userId from the request object then assign to the provider_id variable
    const currentYear = new Date().getFullYear();
    try {
        const options = {
            attributes: [
                [fn('SUM', col('earnings')), 'total_earnings'], 
                [fn('MONTH', col('payment_date')), 'month'],
            ],
            where: {
                payment_date: {
                    [Op.between]: [`${currentYear}-01-01`, `${currentYear}-12-31`] // Restrict the query to the current year
                }
            },
            include: [{ 
                attributes: [],
                model: Transaction,
                where: { provider: provider_id }
            }],
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
        console.log(err);
         // Handle any errors that occur during the process
        res.status(400).json({ error: err.message }); // Send an error response message
    }
}

// Gets the total earnings of the provider this day
const get_provider_today_earnings = async (req, res) => {
    const provider_id = req.userId; // Get the userId from the request object then assign to the provider_id variable
    try{
        // Retrieve the total of the provider's earning this day
        const todayEarnings = await ProviderEarning.findAll({
            attributes: ['earnings'],
            where: {payment_date: {[Op.eq] : new Date()}},
            include: [{
              attributes: [],
              model: Transaction,
              where: { 
                provider: provider_id,
               },
               include: [{
                attributes: [],
                model: AvailableDate,
               }]
            }]
          });

        let sum = 0;
        todayEarnings.forEach(todayEarning => {
            sum += todayEarning.dataValues.earnings
        })
        res.status(200).json({ total_earnings: sum }); 
    }catch(err){
        console.log(err);
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

// This function retrieves the provider's earnings for each month of the current year
const get_company_earning_per_month = async (req, res) => {
    let company_earnings_array  = []; // Initialize an array to hold monthly earnings
    const currentYear = new Date().getFullYear();
    try {
        const options = {
            attributes: [
                [fn('SUM', col('earnings')), 'total_earnings'], 
                [fn('MONTH', col('payment_date')), 'month'],
            ],
            where: {
                payment_date: {
                    [Op.between]: [`${currentYear}-01-01`, `${currentYear}-12-31`] 
                }
            },
            group: [fn('MONTH', col('payment_date'))]
        };        
        
        const company_earnings = await CompanyEarning.findAll(options); // Retrieve the earnings for each month
        // Populate the provider_earnings_array with total earnings indexed by month
        company_earnings.forEach(earning => {
            // Assign the total earnings to the correct index in the array (0-11 for Jan-Dec)
            company_earnings_array[earning.dataValues.month - 1] = earning.dataValues.total_earnings; 
        });

        // Respond with the array of monthly earnings
        res.status(200).json(company_earnings_array);
    } catch (err) {
        console.log(err);
         // Handle any errors that occur during the process
        res.status(400).json({ error: err.message }); // Send an error response message
    }
}

// Gets the total earnings of the provider this day
const get_company_today_earnings = async (req, res) => {
    try{
        // Retrieve the total of the provider's earning this day
        const todayEarnings = await CompanyEarning.sum('earnings', {
            where: {
                payment_date: new Date()
            }
        });

        res.status(200).json({ total_earnings: todayEarnings}); 
    }catch(err){
        console.log(err);
         // Handle any errors that occur during the process
        res.status(400).json({error: err.message}); // Send an error response message
    }
}

export default { 
    get_provider_earning_per_month, 
    get_provider_today_earnings, 
    get_provider_earnings,
    get_company_earning_per_month,
    get_company_today_earnings 
};