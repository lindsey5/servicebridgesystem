import Reviews from "../Components/Reviews/Reviews"
import useFetch from "../../hooks/useFetch";
import { useEffect, useState } from "react";

const ViewReviews = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id');
    const service_name = queryParams.get('service_name');
    const { data } = useFetch(`/api/provider/rating/${id}`);
    const [rating, setRating] = useState();
    useEffect(() => {
        if(data){
            setRating(data.rating);
        }
    }, [data])

    return <Reviews id={id} rating={rating} service_name={service_name}/>
}

export default ViewReviews