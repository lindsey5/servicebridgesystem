import Provider_account from '../../models/provider-account.js';
import bcrypt from 'bcrypt';
import {handleErrors} from '../../utils/authErrorHandler.js';
import tokenCreator from '../../utils/tokenCreator.js';
import ProviderBalance from '../../models/provider-balance.js';

const maxAge = tokenCreator.maxAge;

const signup_post = async (req, res) => {
    try{
        // Create new account in the database
        const provider_account = await Provider_account.create({
            ...req.body // Extract and spread all properties from the request body (req.body)
        });
        const provider_balance = await ProviderBalance.create({id: provider_account.id});
        if(provider_balance && provider_account){
            const token = tokenCreator.createToken(provider_account.id); // Create jwt token based on the create account id
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 }); // Set a secure JWT cookie with specified options
            res.status(201).json({ user: provider_account.id }); // Send a response containing the newly created account ID
        }else{
            res.status(400).json({error: 'Error'});
        }
    }catch(err){
         // Handle any errors that occur during the process
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

// Function to handle user authorization during login
const login_post = async (req, res) => {
    const { username, password } = req.body; // Destructure the username and password from the request body

    try{
        const provider = await Provider_account.findOne({ where: { username}});  // Verify if the account exists in the database using the username variable
        if(provider) {
            // Execute if the username is existed in the database
            const auth = await bcrypt.compare(password, provider.password);  // Compare the password variable with the hashed password stored in the database
            if(auth){
                // Execute if the password from the req.body is match to the hashed password
                const token = tokenCreator.createToken(provider.id); // Create a jwt token based on the account id
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 }); // Set a secure JWT cookie with specified options
                res.status(200).json({ user: provider.id });  // Send a response containing the account ID
            }else throw Error('Incorrect password'); // Throw an error if the password variable is not match to the password that stored in the database
        }else throw Error('Username not found'); // Throw an error if the username is not found in the database
    }catch(err){
         // Handle any errors that occur during the process
        const errors = handleErrors(err);
        res.status(401).json({errors});
    }
}

export default { signup_post, login_post };