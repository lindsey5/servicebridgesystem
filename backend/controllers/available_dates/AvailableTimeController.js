import AvailableDate from "../../models/available-date.js";
import AvailableTime from "../../models/available_time.js";

const create_available_time = async (req, res) => {
    try{
        const id = req.userId;
        const date = req.body.date;
        const time_slot = req.body.time_slot;

        const available_date = await AvailableDate.findOne({
            attributes: ['date_id'],
            where: {
                date,
                provider_id: id
            }
        })

        const available_time = await AvailableTime.findOne({ where: { date_id: available_date.date_id}})
        if(!available_time){
            const newAvailableTime = await AvailableTime.create({date_id: available_date.date_id, time_slot});
            res.status(200).json({newAvailableTime});
        }else{
            const updatedAvailableTime = await available_time.update({ time_slot });
            res.status(200).json({updatedAvailableTime});
        }
    }catch(err){
        console.log(err)
        res.status(400).json({error: err.message});
    }
}

const get_available_time = async (req, res) => {
    try{
        const date = req.query.date || '';
        const provider_id = req.query.id ? req.query.id : req.userId;
        if(!date && !provider_id) throw new Error('Please fill the required field: date & provider_id'); 
        const available_date = await AvailableDate.findOne({ 
            where: {
                date: new Date(date),
                provider_id
            }
        })
        
        const available_time = await AvailableTime.findOne({ where: {date_id: available_date.date_id}});
        if(!available_time) throw new Error('Available Time not found')
        res.status(200).json(available_time)
    }catch(err){
        console.log(err)
        res.status(400).json({error: err.message});
    }
}

export default { create_available_time, get_available_time }