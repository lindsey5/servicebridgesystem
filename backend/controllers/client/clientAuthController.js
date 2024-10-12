import Client_account from '../../models/client-account.js';
import bcrypt from 'bcrypt';
import { handleErrors } from '../../utils/authErrorHandler.js';
import tokenCreator from '../../utils/tokenCreator.js';
const maxAge = tokenCreator.maxAge;

// Function for creating a new client account
const signup_post = async (req, res) => {
    try{
        // Create new account in the database
        const client_account = await Client_account.create({
            ...req.body // Extract and spread all properties from the request body (req.body)
        });
        const token = tokenCreator.createToken(client_account.id); // Create jwt token based on the create account id
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, sameSite: 'strict' }); // Set a secure JWT cookie with specified options
        res.status(201).json({ id: client_account.id }); // Send a response containing the newly created account ID
    }catch(err){
        // Handle any errors that occur during the process
        const errors = handleErrors(err); // Call the handleError function to handle the errors
        res.status(400).json({errors}); // Send an error response
    }
}

// Function to handle user authorization during login
const login_post = async (req, res) => {
    const { username, password } = req.body; // Destructure the username and password from the request body
    try{
        const client = await Client_account.findOne({ where: { username}}); // Verify if the account exists in the database using the username variable
        if(client) {
            // Execute if the username is existed in the database
            const auth = await bcrypt.compare(password, client.password);  // Compare the password variable with the hashed password stored in the database
            if(auth){
                // Execute if the password from the req.body is match to the hashed password
                const token = tokenCreator.createToken(client.id); // Create a jwt token based on the account id
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, sameSite: 'strict' }); // Set a secure JWT cookie with specified options
                res.status(200).json({ id: client.id }); // Send a response containing the account ID
            }else throw Error('Incorrect password'); // Throw an error if the password from the req.body is not match to the password that stored in the database
        }else throw Error('Username not found'); // Throw an error if the username is not found in the database
    }catch(err){
        // Handle any errors that occur during the process
        const errors = handleErrors(err); // Call the handleError function to handle the errors
        res.status(401).json({errors}); // Send an error response
    }
}

export default { signup_post, login_post };