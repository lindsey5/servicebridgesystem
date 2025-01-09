import Portfolio from "../Components/Portfolio/Portfolio"

const ViewPortfolio = () => {

    return <Portfolio data={JSON.parse(localStorage.getItem('provider-data'))}/>
}

export default ViewPortfolio