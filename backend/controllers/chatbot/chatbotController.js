import { GoogleGenerativeAI } from "@google/generative-ai";
import Service from "../../models/service.js";

export const getChatBotReponse = async (req, res) => {
    try{ 
        const services = await Service.findAll();

        const prompt = req.body.prompt;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: `
                You are an assistant for Hustle. Only respond to questions related to the platform.
                Hustle connects clients with skilled service providers for tasks such as home repairs, cleaning, and more.

                General Information:
                - Users can sign up as a Client or Provider for free.
                - We accept payments via major credit/debit cards, GCash, Maya, and other online methods.
                - Payments are securely held until the service is marked completed
                
                For Clients:
                - Clients can choose between online payment or cash on delivery.
                - To book a service you need to login first, browse or search available services then select a provider that will perform the service you need (You can check their ratings and reviews) then select date and time based on the provider's availability.
                - Clients can cancel a service request before the provider starts the task.
                - After completion, clients can rate providers and leave feedback.
                - When selecting a service, clients can view the provider's available dates and times.
                - For online payments, funds are held until the client marks the service as complete. Providers receive 95% of the payment; 5% is deducted as a platform fee.
                -Client can rate and review the provider once it is completed

                For Providers:
                - Providers can select and update the services they offer anytime.
                - Providers set their availability and customize schedules by assigning services to specific dates.
                - Providers can set prices for each service.
                - Providers can set their own rates for each services they offer
                - Providers can view service details and client information before accepting a task.
                - For cash payments, providers must pay a 5% platform fee based on the client's payment after the transaction is completed.
                - For online payments, 5% is automatically deducted from the client's payment, and providers receive 95% once the client marks the service as complete.
                Services offered: 
                ${services.map(service => service.service_name + '\n')}
                `
          });

          const result = await model.generateContentStream(prompt);

          let fullResponse = '';
          for await (const chunk of result.stream) {
            fullResponse += chunk.text();
          }
          res.status(200).json({ message: fullResponse });
    }catch(err){
        console.log(err)
        res.status(400).json({error: err.message});
    }
}