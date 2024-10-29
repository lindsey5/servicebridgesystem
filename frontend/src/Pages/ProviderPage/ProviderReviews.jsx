import Reviews from "../Components/Reviews/Reviews";
import { useContext } from "react";
import { ProviderContext } from "../../Context/ProviderContext";

const ProviderReviews = () => {
    const { id, rating } = useContext(ProviderContext);
    return <Reviews id={id} rating={rating} isProvider={true}/> 

}

export default ProviderReviews;