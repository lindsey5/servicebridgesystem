import { useEffect, useState, useContext } from "react";
import useFetch from "../../hooks/useFetch";
import './ProviderServices.css';
import createImageSrc from "../../utils/createImageSrc";
import '../styles/SuccessModal.css';

const ProviderServices = () => {
    const [services, setServices] = useState([]);
    const { data } = useFetch('/api/services');
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuccess, setSuccessModal] = useState(false);

    useEffect(() => {
        document.title = "Services List | Provider";
    },[]);

    useEffect(() => {
        const loadImages = async () => {
            if (data?.services) {
                const servicesWithImages = await Promise.all(
                    data.services
                        .filter(service => 
                            service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            service.category_name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map(async (service) => {
                            const imageSrc = await createImageSrc(service.categoryIcon.data);
                            return { ...service, imageSrc };
                        })
                );
                setServices(servicesWithImages);
            }
        };
        loadImages();
    }, [data, searchTerm]);

    async function addService(serviceName){
       if(confirm('Do you want to add this service?')){
        try{
            const response = await fetch('http://localhost:3000/api/services-offered',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    service_name: serviceName
                }),
                credentials: 'include'
            });
            if(response.ok){
                const result = await response.json();
                if(result.error){
                    alert(result.error);
                }else{
                    setSuccessModal(true);
                }
            }
        }catch(error){
            console.log(error);
        }
       }
    }

    const CategorySelect = () => {
        const {data } = useFetch('/api/category');
        return (
            <select className="select-category" onChange={(e)=> setSearchTerm(e.target.value)} value={searchTerm}>
                 <option value="">All Categories</option>
                {data && data.map(category => {
                    const category_name = category.category_name;
                    return (<option key={category.category_name} value={category_name}>{category_name}</option>)
                })}
            </select>
        )
    }

    return (
        <div className="services-page">
            {showSuccess &&
                <div className="success-modal">
                    <img src="/icons/check.png" alt="Success" />
                    <h2>Successfully Added</h2>
                    <button className="continue-btn" onClick={() => setSuccessModal(false)}>Close</button>
                </div>
            }
            <div className="top-section">
                <h1>Select Services</h1>
                <input className="search-bar" type="text" placeholder="Search" onChange={(e) => setSearchTerm(e.target.value)} />
                <CategorySelect />
            </div>
            <div className="services-container">
                {services.map((service) => (
                    <div key={service.service_name} className="service" onClick={()=> addService(service.service_name)}>
                        <img src={service.imageSrc} className="category-icon" />
                        <h1 className="service-name">{service.service_name}</h1>
                        <h3>Category: {service.category_name}</h3>
                        <h3>(Click to Add)</h3>
                    </div>
                ))}
            </div>
        </div> 
    );
};

export default ProviderServices
