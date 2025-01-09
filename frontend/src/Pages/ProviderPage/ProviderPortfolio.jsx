import { useContext, useEffect } from "react"
import useFetch from "../../hooks/useFetch"
import Portfolio from "../Components/Portfolio/Portfolio"
import { ProviderContext } from "../../Context/ProviderContext"

const ProviderPortfolio = () => {
    const { data } = useFetch('/api/provider')
    const { id } = useContext(ProviderContext);
    const { data: totalTransactions } = useFetch('/api/transactions/completed/total')

    return <Portfolio data={{
            id, 
            fullname: `${data?.firstname} ${data?.lastname}`,
            location: data?.location,
            image: data?.profile_pic, 
            bio: data?.bio,
            total_task: totalTransactions?.completed_transactions_total
        }}
        isProvider={true}
    />
}

export default ProviderPortfolio