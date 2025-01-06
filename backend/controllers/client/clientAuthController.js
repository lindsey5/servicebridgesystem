import Client_account from '../../models/client-account.js';
import bcrypt from 'bcrypt';
import { handleErrors } from '../../utils/authErrorHandler.js';
import tokenCreator from '../../utils/tokenCreator.js';
import { sendVerificationCode } from '../../services/emailService.js';
const maxAge = tokenCreator.maxAge;

// Function for creating a new client account
const signup_post = async (req, res) => {
    try{
        const isExist = await Client_account.findOne({where: {email: req.body.email}})
        if(isExist){
            throw new Error ('Email already used');
        }
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
    const { email, password } = req.body; // Destructure the username and password from the request body
    try{
        const client = await Client_account.findOne({ where: { email }}); 
        if(client) {
            // Execute if the username is existed in the database
            const auth = await bcrypt.compare(password, client.password);  // Compare the password variable with the hashed password stored in the database
            if(auth){
                // Execute if the password from the req.body is match to the hashed password
                const token = tokenCreator.createToken(client.id); // Create a jwt token based on the account id
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, sameSite: 'strict' }); // Set a secure JWT cookie with specified options
                res.status(200).json({ id: client.id }); // Send a response containing the account ID
            }else throw Error('Incorrect password'); // Throw an error if the password from the req.body is not match to the password that stored in the database
        }else throw Error('Email not found'); // Throw an error if the username is not found in the database
    }catch(err){
        // Handle any errors that occur during the process
        const errors = handleErrors(err); // Call the handleError function to handle the errors
        res.status(401).json({errors}); // Send an error response
    }
}

const clientSignupVerificationCode = async (req, res) => {
    try{    
        const user = await Client_account.findOne({
            where: { email: req.query.email}
        });

        if(user){
            throw new Error('Email is already used')
        }
        const verificationCode = await sendVerificationCode(req.query.email)
        res.cookie('verificationCode', verificationCode, {
          maxAge: 60000,
          secure: process.env.NODE_ENV === 'production' });
        res.status(200).json({message: 'Verification code successfully sent'})
    }catch(err){
        res.status(401).json({error: err.message});
    }
}

const clientSendVerificationCode = async (req, res) => {
    try {
        const client = await Client_account.findOne({ where: {email: req.body.email}})

        if(!client) throw new Error("Email doesn't exist")

        const verificationCode = await sendVerificationCode(req.body.email)
        res.cookie('verificationCode', verificationCode, {
            maxAge: 60000,
            secure: process.env.NODE_ENV === 'production'
        })

        res.status(200).json({message: 'Verification code successfully sent'})

    } catch (err) {
        console.log(err)
        res.status(401).json({error: err.message});
    }
}

const clientUpdatePassword = async (req, res) => {
    try{
        const { currPassword, newPassword } = req.body;
        const client = await Client_account.findByPk(req.userId);
        const isCorrect = await bcrypt.compare(currPassword, client.password); 
        if(!isCorrect){
            throw new Error('Incorrect password')
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        await client.update({password: hashedPassword});
        res.status(200).json({success: true, message: 'Client password successfully changed'})
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

const clientResetPassword = async (req, res) => {
    try{
        const { email, newPassword } = req.body;
        const client = await Client_account.findOne({where: {email}});

        if(!client) throw new Error("Client doesn't exist")
        
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        await client.update({password: hashedPassword});

        res.status(200).json({success: true, message: 'Client password successfully change'})

    }catch(err){
        res.status(400).json({error: err.message});
    }
}


export default { signup_post, login_post, clientSignupVerificationCode, 
    clientUpdatePassword, clientSendVerificationCode, clientResetPassword };