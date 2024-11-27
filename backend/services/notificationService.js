import Notification from "../models/notification.js"

const sendNotification = async (data) => {
    try{
        const notification = await Notification.create({
            message: data.message,
            recipient_id: data.recipient_id,
        })
        return notification;

    }catch(err){
        throw new Error('Error sending notification')
    }
}

export default { sendNotification }