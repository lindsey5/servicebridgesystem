import Client_account from '../../models/client-account.js';

// This function get the client details from the databased based on the client id
const get_client = async (req, res) => {
    try {
        const client_id = req.userId; // Retrieve the userId from the req object and assign it to the client_id variable
        const client = await Client_account.findOne({ where: { id: client_id } }); // Verify if a client exists using the client_id variable
        if(client){
            // Execute if the client is found using the client_id variable
            const { password, ...clientWithoutPassword } = client.toJSON(); // Exclude the password from the client object
            res.status(200).json({ client: clientWithoutPassword }); // Respond with the client data
        }else{
            res.status(404).json({ error: 'Client not found' }); // Respond an error message if the client is not found 
        }
    } catch (err) {
        // Handle any errors that occur during the process
        res.status(400).json({ error: err.message }); // Respond an error message
    }
};

// This function retrieve the client's fullname
const get_client_name = async (req, res) => {
    const client_id = req.params.id; // Retrieve the client ID from the request parameters
    try{
        const client = await Client_account.findOne({ where: { id: client_id }}); // Verify if the client is exist from the database using the client_id variable
        if(client){
            // Execute if the client is found from the database
            const fullname = client.firstname + ' ' + client.lastname; // Concat the firstname and lastname of the client
            res.status(200).json({ fullname }); // Respond with the client's fullname
        }else{
            res.status(400).json({error: 'Client not found'}); // Respond an error message if the client is not found
        }
    }catch(err){
        // Handle any errors that occur during the process
        res.status(400).json({ error: err.message }); // Respond an error message
    }
}


// This function gets the client's address
const get_client_address = async (req, res) => {
    const client_id = req.params.id; // Get the id from the request parameters and assign it to the client_id variable
    try{
        const client = await Client_account.findOne({ where: { id: client_id}}); // Verify if the client is exist from the database using the client_id variable
        if(client){
            const address = client.address; // Get the address from client object 
            res.status(200).json({address}); // Send a response with the client's address
        }else{
            res.status(400).json({error: 'Client not found'}); // Send an error response if the client is not found in the database
        }
    }catch(err){
        // Handle any errors that occur during the process
        res.status(400).json({ error: err.message }); // Send an error response
    }
}


export default { get_client, get_client_name, get_client_address }