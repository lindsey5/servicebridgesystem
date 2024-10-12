import ProviderEarning from "../models/provider-earning.js";
import CompanyEarning from "../models/company-earning.js";

const post_earnings = async (service_price, transaction_id) =>{
    const company_earnings= service_price * 0.05; // Get the 10% of the service_price variable then assign to the company_earnings variable
    const provider_earnings = service_price - company_earnings; // Get the service_price then minus the value of company_earnings variable
    try{
        const providerEarning = await ProviderEarning.create({transaction_id, earnings: provider_earnings}); // Records a new Provider earnings in the database
        const companyEarning = await CompanyEarning.create({transaction_id, earnings: company_earnings}); // Records a new Company earnings in the database
        if(providerEarning && companyEarning){
            return {providerEarning, companyEarning}
        }else{
            return null
        }
    }catch(err){
        throw new Error(err.message);
    }
}

export default { post_earnings }