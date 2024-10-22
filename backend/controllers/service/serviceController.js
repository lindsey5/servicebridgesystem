import Category from '../../models/category.js';
import Service from '../../models/service.js';
import { col, fn, Sequelize } from 'sequelize';
import Transaction from '../../models/transaction.js';

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

export default { service_findAll, services_byCategory, get_top_services } 