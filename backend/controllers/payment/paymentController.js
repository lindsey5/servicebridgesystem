import fetch from "node-fetch";
import jwt from 'jsonwebtoken';

const create_checkout_link = async (req, res) => {
    try{
        const data = req.body.data;
        const amount = data.price * 100;
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const client_id = decodedToken.id;
        const options = {
            method: 'POST',
            headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: 'Basic c2tfdGVzdF9Razh2Q1ZkdUJaOTFZRmtRTEhyTEpXR0E6'
            },
            body: JSON.stringify({
            data: {
                attributes: {
                send_email_receipt: false,
                show_description: false,
                show_line_items: true,
                cancel_url: 'http://localhost:5173/',
                success_url: `http://localhost:5173/`,
                line_items: [{currency: 'PHP', amount, quantity: 1, name: `${data.service_name}`}],
                payment_method_types: [
                    'gcash',
                    'paymaya',
                    'brankas_landbank',
                    'card',
                    'dob',
                    'dob_ubp',
                    'brankas_metrobank'
                ],
                metadata: {
                    client: client_id,
                    provider: data.provider, 
                    service_name: data.service_name, 
                    price: data.price, 
                    payment_method: data.paymentMethod,
                    date_id: data.date_id, 
                    time: data.time
                }
                }
            }
            })
        };
        const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', options)
        if(response.ok){
            const result = await response.json();
            console.log(result);
            res.status(200).json({id: result.data.id, checkout_url: result.data.attributes.checkout_url});
        }else{
            throw new Error("Failed to create checkout url");
        }
    } catch(err){
        console.log(err);
        res.status(400).json({error: err});
    }
    
}

export default { create_checkout_link }