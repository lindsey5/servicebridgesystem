import Category from "../../models/category.js"

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

export default { get_categories };