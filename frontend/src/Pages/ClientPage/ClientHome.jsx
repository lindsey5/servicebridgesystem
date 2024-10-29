import './ClientHome.css';
import searchLogo from '../../assets/search (1).png';
import serviceIcon from '../../assets/service.png';
import defaultProfilePic from '../../assets/user (1).png';
import { ClientContext } from '../../Context/ClientContext';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';

const ClientHome = () => {
    const context = useContext(ClientContext);
    const navigate = useNavigate();
    const { data } = useFetch('/api/services/top');
    const [popServices, setPopServices] = useState();

    useEffect(() => {
        document.title = "Client";
    },[])

    useEffect(() => {
        if(data?.services){
            setPopServices(data.services.map(service => service.service_name));
        }
    }, [data])

    return (
        <div className='client-home'>
            <div className="home-container">
                <div className="account-container">
                    <div className="profile-pic-container">
                        <img src={context.profile_pic ? context.profile_pic : defaultProfilePic} className='profile-pic' />
                    </div>
                    <h1 id="fullname">{context.fullname && context.fullname}</h1>
                    <button id="acc-setting">Account Setting</button>
                </div>

                <div>
                    <div className="popular-services-container">
                        <h1>Popular services</h1>
                        <div className="popular-services-div">
                        {popServices && popServices.map(service => 
                            <div key={service} className="popular-services" onClick={() => navigate(`/Client/Search/Result?searchTerm=${service}`)}>
                            <img src={searchLogo} alt="Search Icon"/>
                            {service}
                            </div>
                        )}
                        </div>
                    </div>

                    <div className="view-all-services-container">
                        <img src={serviceIcon} alt="Service Icon"/>
                        <p>Click here to show all the services offered by Hustle</p>
                        <button className="view-services-btn" onClick={() => navigate('/Client/Services')}>View Services</button>
                    </div>

                    <div className="how-it-work-container">
                        <h1>How it works</h1>
                        <div>
                            <div className="number">1</div>
                            <p>Explore Available Services</p>
                        </div>
                        <div>
                            <div className="number">2</div>
                            <p>Find Service Provider</p>
                        </div>
                        <div>
                            <div className="number">3</div>
                            <p>Book Your Appointment</p>
                        </div>
                        <div>
                            <div className="number">4</div>
                            <p>Track Appointment Status</p>
                        </div>
                        <div>
                            <div className="number">5</div>
                            <p>Receive the service as scheduled</p>
                        </div>
                        <div>
                            <div className="number">6</div>
                            <p>Give Feedback</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClientHome;