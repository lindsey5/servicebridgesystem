import { Sequelize } from 'sequelize';
import Service from '../../models/service.js';
import Services_offered from '../../models/service_offered.js';

const get_services_offered = async (req, res) => {
    try{
        const provider_id = req.userId;
        const query = { 
            where: { provider_id: provider_id },
            include: [{
                model: Service,
                attributes: ['category_name']
            }],
            attributes: ['service_id', 'service_name', 'price', [Sequelize.col('Service.category_name'), 'category']],
            order:[
                ['service_name', 'ASC']
            ]
        
        }
        const services = await Services_offered.findAll(query);
        if(services){
            res.status(200).json({services});
        }else{
            res.status(404).json({error: 'No records found'});
        }
    }catch(err){
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}

const delete_service_offered = async (req, res) => {
    try{
        const service_id = req.params.id;
        const service_offered = await Services_offered.findByPk(service_id);
        if(service_offered){
            await service_offered.destroy();
            res.status(200).json({ redirect: '/provider/services'});
        }else{
            res.status(400).json({error: 'Deletion error: data not found'})
        }
    }catch(err){
        res.status(400).json({ error: err.message });
    }
}

const add_service_offered = async (req, res) => {
    const service_offered = req.body;
    const provider_id = req.userId;
    try{
        const service = await Services_offered.findOne({where: {
            provider_id: provider_id,
            service_name: service_offered.service_name
        }});
        if(service){
            res.json({ error: 'Service already exist'});
        }else{
            await Services_offered.create({
                provider_id: provider_id,
                service_name: service_offered.service_name,
                price: 0
            });
            res.json({success: 'Service successfully added'});
        }
    }catch(err){
        console.log(err)
        res.status(400).json({ error: err.message });
    }
}

const update_service_offered = async (req, res) => {
    const service_id = req.params.id;
    const updatedData = req.body;
    
    try{
        const service_offered = await Services_offered.findByPk(service_id)
        if(service_offered){
            await service_offered.update(updatedData);
            res.status(200).json({redirect: '/provider/services'});
        }
    }catch(err){
        res.status(400).json({ error: err.message });
    }
}

export default { get_services_offered, delete_service_offered, add_service_offered, update_service_offered}