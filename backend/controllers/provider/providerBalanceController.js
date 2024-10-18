import ProviderBalance from "../../models/provider-balance.js"

const get_balance = async (req, res) => {
    const id = req.userId;
    try{
        const balance = await ProviderBalance.findOne({
            attributes: ['balance'],
            where:{id }
        })

        res.status(200).json(balance);

    }catch(err){
        res.status(400).json({error: err.message})
    }

}

export default {get_balance}