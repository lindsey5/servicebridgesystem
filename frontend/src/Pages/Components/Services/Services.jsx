import { useState, useEffect } from "react";
import useFetch from "../../../hooks/useFetch";
import createImageSrc from "../../../utils/createImageSrc";
import '../../styles/Services.css'
import { useNavigate } from "react-router-dom";

const Services = ({showLoginModal}) =>{
    const [categories, setCategories] = useState(null);
    const navigate = useNavigate();

    const { data } = useFetch('/api/category');
    useEffect(()=>{
        setCategories(data);
    }, [data]);

    const ServicesByCategory = ({category}) => {
        const {data: services} = useFetch(`/api/services/${category}`);

        return (
            <div className='services-child-container'>
            {services && services.map(service => 
            <p key={service.service_name} 
                onClick={() => showLoginModal ? showLoginModal() : 
                navigate(`/Client/Search/Result?searchTerm=${service.service_name}`)}>
            {service.service_name}
            </p>)}
            </div>
        )
    }

    const CategoryDiv = ({category}) => {
        const [imgSrc, setImgSrc] = useState();
        useEffect(() => {
           const getImageSrc = async () =>{
                const imageSrc = await createImageSrc(category.icon.data);
                setImgSrc(imageSrc);
           }
           getImageSrc();
        },[category])

        return (
            <div className='services-parent-container'>
                <img src={imgSrc} />
                <h1>{category.category_name}</h1>
                <ServicesByCategory category={category.category_name}/>
            </div>)
    }

    return (
        <div id="services" className='services-section'>
            <h1>Services Offered</h1>
            <div className='categories-container'>
            {categories && categories.map((category) => <CategoryDiv key={category.category_name} category={category}/>)}
            </div>
        </div>
    )
}

export default Services;