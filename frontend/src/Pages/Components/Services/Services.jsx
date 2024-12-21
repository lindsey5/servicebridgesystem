import { useState, useEffect, useRef } from "react";
import useFetch from "../../../hooks/useFetch";
import '../../styles/Services.css'
import { useNavigate } from "react-router-dom";

const Services = ({showLoginModal}) =>{
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(3);
    const next = useRef();
    const back = useRef();
    const { data, loading } = useFetch('/api/category');
    const [documentWidth, setDocumentWidth] = useState(document.body.scrollWidth);

    useEffect(()=>{
        if(data){
            setCategories(data);
        }
    }, [data]);

    useEffect(() => {
        const handleResize = () => {
            setDocumentWidth(document.body.scrollWidth);
        };

        // Set initial width
        handleResize();

        // Add event listener to handle resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
        /*const [imgSrc, setImgSrc] = useState();
        useEffect(() => {
           const getImageSrc = async () =>{
                try{
                    console.log(category)
                    const response = await fetch(`https://pixabay.com/api/?key=46701607-d51d8d8ab7e9bf8a22e03cd3c&q=${category.category_name}&image_type=photo`);
                    if(response.ok){
                        const result = await response.json();
                        setImgSrc(result.hits[5].largeImageURL);
                    }
                }catch(err){
                    
                }
           }
           getImageSrc();
        },[category])*/
        return (
            <div className='services-parent-container'>
                <img src={`/photos/${category.category_name}.jpg`} />
                <h1>{category.category_name}</h1>
                <ServicesByCategory category={category.category_name}/>
            </div>)
    }

    const nextPage = () => {
        setStart(start + 1); setEnd(end + 1)
    }

    const backPage = () => {
        setStart(start - 1)
        setEnd(end - 1);
    }

    return (
        <div id="services" className='services-section'>
            <h1>Services Offered</h1>
            {!loading && 
            <>
                <div className='categories-container'>
                {categories.length > 0 && documentWidth < 1005 ? categories.map((category, i) => (
                    <CategoryDiv key={i} category={category} />
                ))
                
                : categories.slice(start, end).map((category, i) => (
                    <CategoryDiv key={i} category={category} />
                ))
                }
                </div>
                {documentWidth > 1005 && 
                <>
                <button className="prev" style={{display: start === 0 ? 'none' : 'block'}} onClick={backPage} ref={back}>&#10094;</button>
                <button className="next" style={{display: end === categories.length ? 'none' : 'block'}} onClick={nextPage} ref={next}>&#10095;</button>
                </>
                }
            </>
            }
        </div>
    )
}

export default Services;