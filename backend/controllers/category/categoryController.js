import Category from "../../models/category.js"

const create_category = async (req, res) => {
    try{
        const isExist = await Category.findOne({
            where: {
                category_name: req.body.category_name
            }
        })

        if(isExist) throw new Error('Category Already Exist')

        const service = await Category.create({
            category_name: req.body.category_name,
            icon: req.body.icon
        })
        res.status(200).json(service);
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

const delete_category = async (req, res) => {
    try{
        const category = await Category.findByPk(req.params.category_name);
        if(!category) throw new Error('Category doesn\'t exist');
        await category.destroy();
        res.status(200).json({message: "Category successfully remove"});
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

const get_categories = async (req, res) => {
    try{
        const category = await Category.findAll(); // Fetch all the categories from the database
        if (category) {
            // Send the response with the categories if there's categories found in the database
            res.status(200).json(category); // Send a response containing all the categories found
        }        
    }catch(err){
        console.log(err);
        // Handle any errors that occur during the process
        res.status(400).json({error: err.message});
    }
}

export default { get_categories, create_category, delete_category };