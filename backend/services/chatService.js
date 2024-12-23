import Message from "../models/message.js";
import { Op } from 'sequelize';

const fetchChatPartners = async (userId) => {
    try {
        // Fetch distinct chat partners with filtering done in the query
        const chatPartners = await Message.findAll({
            where: {
            [Op.or]: [
                { from_user_id: userId },
                { to_user_id: userId }
            ],
            },
            order: [['timestamp', 'DESC']]
        });
      
        const chatPartnerIds = new Set(); // Use Set to ensure uniqueness

        chatPartners.forEach(partner => {
            // Extract the from and to user IDs
            const { from_user_id, to_user_id } = partner.dataValues;
        
            // Add both IDs to the set if they are not the current user
            if (from_user_id !== userId) {
            chatPartnerIds.add(from_user_id);
            }
            if (to_user_id !== userId) {
            chatPartnerIds.add(to_user_id);
            }
        });
        return Array.from(chatPartnerIds)
    } catch (error) {
        throw new Error('Could not fetch chat partners');
    }
}

const createPrivateMessage = async (to, from, message, status) => {
    try{
        const query = {
            from_user_id: from, 
            to_user_id: to, 
            content: message,
            status
        }
        // Save message to the database
        const newMessage = await Message.create(query);

        return newMessage;
    }catch(err){
        console.error('Error creating private message:', err);
        throw new Error('Could not send private message');
    }
}

const fetchPastMessages = async (recipient, userId) => {
    try {
        const pastMessages = await Message.findAll({
            where: {
                [Op.or]: [
                    {
                        to_user_id: recipient,
                        from_user_id: userId
                    },
                    {
                        to_user_id: userId,
                        from_user_id: recipient
                    }
                ]
            },
            order: [
              ['timestamp', 'ASC']
            ]
        });
    
        return pastMessages;
    } catch (error) {
        console.error('Error fetching past messages:', error);
        throw new Error('Could not fetch past messages');
    }
}

const fetchLatestMessage = async (you, partner) =>{
    const latestMessage = await Message.findOne({
     where: {
        [Op.or]: [
            {
                to_user_id: partner,
                from_user_id: you
            },
            {
                to_user_id: you,
                from_user_id: partner
            }
          ],
        },
        order: [
          ['timestamp', 'DESC']
        ]
    });
    if(latestMessage){
        return latestMessage
    }else{
        throw new Error("No message found");
    }
}


export default { fetchChatPartners, createPrivateMessage, fetchPastMessages, fetchLatestMessage }