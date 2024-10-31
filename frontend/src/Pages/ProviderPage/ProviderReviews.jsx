import Reviews from "../Components/Reviews/Reviews";
import { useContext, useEffect } from "react";
import { ProviderContext } from "../../Context/ProviderContext";

const ProviderReviews = () => {
    const { id, rating } = useContext(ProviderContext);

    useEffect(() => {
        document.title = "Reviews | Provider";
    },[]);

    return <Reviews id={id} rating={rating} isProvider={true}/> 

}

export default ProviderReviews;