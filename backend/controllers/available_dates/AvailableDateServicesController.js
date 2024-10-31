import AvailableDate from "../../models/available-date.js";
import AvailableDateService from "../../models/available_dates_services.js";
import provider_account from "../../models/provider-account.js";
import ProviderServiceOffered from "../../models/service_offered.js";

const create_available_date_service = async (req, res) => {
    try{
        const isExist = await AvailableDateService.findOne({
            where: {
                ...req.body
            }
        })
        if(!isExist){
            const availableDateService = await AvailableDateService.create({
                ...req.body
            })

            if(availableDateService){
                res.status(200).json(availableDateService);
            }else{
                throw new Error('Creating Avaiable Date Service failed')
            }
        }else{
            throw new Error('Service is already exist in that date')
        }
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

const get_available_date_services = async (req, res) => {
    const date = req.params.date;
    const id = req.userId;
    try{
        const available_date_services = await AvailableDateService.findAll({
            include: [
                {
                    model: ProviderServiceOffered,
                },
                {   
                    attributes: [],
                    model: AvailableDate,
                    where: { date },
                    include: [
                        {   
                            attributes: [],
                            model: provider_account,
                            where: { id}
                        }
                    ]
                }
            ]
        })
        const spreadedAvailableDateServices = available_date_services.map(available_date_service =>{
            const { dataValues: { ProviderServiceOffered, ...otherValues } } = available_date_service;
            const service = {...ProviderServiceOffered.dataValues};

            return {
                ...service,
                ...otherValues
            }
           
        }
        )
        res.status(200).json(spreadedAvailableDateServices);

    }catch(err){
        res.status(400).json({error: err.message});
    }
}

export default { create_available_date_service, get_available_date_services }