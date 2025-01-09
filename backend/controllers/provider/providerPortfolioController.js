import Porfolio from "../../models/portfolio.js"

export const create_portfolio = async (req, res) => {
    try{
        const id = req.userId;
        await Porfolio.destroy({
            where: { provider_id: id},
            
        })
        const { contents } = req.body;

        if(contents.length > 0)
            contents.forEach(async (content) => {
                console.log(content)
                await Porfolio.create({ content, provider_id: id})
            })
        res.status(200).json({success: 'Adding portfolio successfully completed'})
    }catch(err){
        console.log(err)
        res.status(400).json({error: err.message})
    }
}

export const get_portfolios = async (req, res) => {
    try{
        const id = req.params.id;

        const portfolios = await Porfolio.findAll({
            where: {
                provider_id: id
            }
        })

        res.status(200).json(portfolios)

    }catch(err){
        console.log(err)
        res.status(400).json({error: err.message})
    }
}