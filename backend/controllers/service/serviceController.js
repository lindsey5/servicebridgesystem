import Category from '../../models/category.js';
import Service from '../../models/service.js';
import { col, fn, Op, Sequelize } from 'sequelize';
import Transaction from '../../models/transaction.js';

const create_service = async (req, res) => {
    try{
        const isExist = await Service.findOne({
            where: {
                service_name: req.body.service_name,
                category_name: req.body.category_name
            }
        })

        if(isExist) throw new Error('Service Already Exist')

        const service = await Service.create({
            service_name: req.body.service_name,
            category_name: req.body.category_name
        })
        res.status(200).json(service);
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

const update_service = async (req, res) => {
    try {
        const { service_name, category_name, updatedServiceName } = req.body;
        
        if (!service_name || !category_name || !updatedServiceName) {
            return res.status(400).json({ error: 'Missing required fields: service_name, category_name, updatedServiceName' });
        }

        const service = await Service.findOne({ where: { service_name } });

        if (!service) {
            return res.status(404).json({ error: 'Service does not exist' });
        }

        await service.destroy();

        const updatedService = await Service.create({
            service_name: updatedServiceName,
            category_name
        })

        res.status(200).json({
            message: 'Service successfully updated',
            updatedService
        });

    } catch (err) {
        // Catch any unexpected errors
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};

const delete_service = async (req, res) => {
    try{
        const service = await Service.findByPk(req.params.service_name);
        if(!service) throw new Error('Service name doesn\'t exist');
        await service.destroy();
        res.status(200).json({message: "Service successfully remove"});
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

const get_paginated_services = async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm;
        const page = req.query.page || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1 ) * limit;

        const query = {
            where: {
                [Op.or]: [
                  Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('service_name')), {
                    [Op.like]: `%${searchTerm.toLowerCase()}%`
                  }),
                  Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('category_name')), {
                    [Op.like]: `%${searchTerm.toLowerCase()}%`
                  })
                ]
            },
        }

        const totalRows = await Service.count(query);
        query.offset = offset;
        query.limit = limit;
        const totalPages = Math.ceil(totalRows / limit);
        const services = await Service.findAll(query);

        if (services) {
           res.status(200).json({services, totalPages});
        }else{
            throw new Error('No services found')
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({error: err.message})
    }
};

const service_findAll = async (req, res) => {
    try{
        const services = await Service.findAll({
            include:[{
                model: Category,
                attributes: ['icon']
            }],
            attributes:[
                'service_name', 'category_name',
                [Sequelize.col('Category.icon'), 'categoryIcon']
            ],
            order:[
                ['service_name', 'ASC']
            ]
            
        });

        if(services){
            res.status(200).json({services});
        }else{
            res.status(400).json({error: 'No services found'});
        }
    }catch(err){
        console.error('Error fetching data:', err);
        res.status(400).json({ error: err.message });
    }
}

const services_byCategory = async (req, res) =>{
    const category_name = req.params.category;

    try{
        const services = await Service.findAll({
            where:{ category_name },
            order:[
                ['service_name', 'ASC']
            ]
        })
        if(services.length > 0){
            res.status(200).json(services);
        }else{
            res.status(404).json({message: `Services with ${category_name} category is not found`});
        }
    }catch(err){
        res.status(400).json({message: err.message});
    }
}

const get_top_services = async (req, res) => {
    try{
        const services = await Transaction.findAll({
            attributes: [
                'service_name',
                [fn('COUNT', col('service_name')), 'service_count']
            ],
            group: ['service_name'],
            order: [[fn('COUNT', col('service_name')), 'DESC']],
            limit: 10
        });
        res.status(200).json({services});

    }catch(err){
        console.log(err);
        res.status(400).json({error: err.message});
    }
}

export default { 
    create_service, 
    delete_service,
    update_service,
    service_findAll, 
    get_paginated_services, 
    services_byCategory, 
    get_top_services 
} 