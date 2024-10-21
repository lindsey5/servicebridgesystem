import { useEffect, useState, useContext } from "react"
import useFetch from "../../hooks/useFetch";
import './ProviderServicesOffered.css';
import EditPriceModal from "../../modals/EditServicePriceModal";
import { deleteServiceOffered } from "../../services/servicesOfferedService";

const ProviderServicesOffered = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [services, setServices] = useState([]);
    const { data } = useFetch('/api/services-offered');
    const [serviceDetails, setServiceDetails] = useState({service_id: null, price: 0});
    const [showEditModal, setEditModal] = useState(false);
    useEffect(() => {
        document.title = "Your Services | Provider";
    },[]);    

    useEffect(() => {
        const loadServices = () => {
            if (data?.services) {
                const filteredServices = data.services.filter(service => 
                    service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    service.category.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setServices(filteredServices);
            }
        };
        loadServices();
        
    }, [data, searchTerm]);

    const CategorySelect = () => {
        const {data: categories } = useFetch('/api/category');
        return (
            <select className="select-category" onChange={(e)=> setSearchTerm(e.target.value)} value={searchTerm}>
                 <option value="">All Categories</option>
                {categories && categories.map(category => {
                    const category_name = category.category_name;
                    return (<option key={category.category_name} value={category_name}>{category_name}</option>)
                })}
            </select>
        )
    }

    return (
        <div className="your-services">
            <EditPriceModal setEditModal={setEditModal} showEditModal={showEditModal} serviceDetails={serviceDetails} setServiceDetails={setServiceDetails}/>

            <div className="top-section">
                <h1>Your Services</h1>
                <input className="search-bar" type="text" placeholder="Search" onChange={(e) => setSearchTerm(e.target.value)} />
                <CategorySelect />
            </div>
            <div className="services-container">
            {services.map((service) => {
                const formattedPrice = service.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                return (
                    <div key={service.service_name} className="service">
                        <h2>{service.service_name}</h2>
                        <h3>₱ {formattedPrice}</h3>
                        <h3>Category: {service.category}</h3>
                        <div className="buttons-container">
                            <button onClick={() =>{
                                setEditModal(true);
                                setServiceDetails({
                                    service_id: service.service_id,
                                    price: service.price
                                })
                            }}>
                                <img src="/icons/settings.png" />
                                <span className="tool-tip-price">Edit Price</span>
                            </button>
                            <button onClick={() => deleteServiceOffered(service.service_id)}>
                                <img src="/icons/trash-bin.png" />
                                <span className="tool-tip-remove">Remove</span>
                            </button>
                       </div>
                    </div>
                )
            }
            )}
            </div>
        </div>
    )
}

export default ProviderServicesOffered;
