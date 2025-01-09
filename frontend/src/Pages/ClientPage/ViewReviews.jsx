import Reviews from "../Components/Reviews/Reviews"

const ViewReviews = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id');
    const service_name = queryParams.get('service_name');

    return <Reviews id={id} service_name={service_name}/>
}

export default ViewReviews