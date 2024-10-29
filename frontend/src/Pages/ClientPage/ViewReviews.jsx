import Reviews from "../Components/Reviews/Reviews"
import useFetch from "../../hooks/useFetch";
import { useEffect, useState } from "react";

const ViewReviews = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id');
    const { data } = useFetch(`/api/provider/rating/${id}`);
    const [rating, setRating] = useState();
    useEffect(() => {
        if(data){
            setRating(data.rating);
        }
    }, [data])

    return <Reviews id={id} rating={rating}/>
}

export default ViewReviews