import { useNavigate } from "react-router-dom"
import '../styles/sidebar.css'
import { useContext, useRef } from "react"
import { ProviderContext } from "../../Context/ProviderContext";

export default function ProviderSideBar () {
    const { isSidebarShorten } = useContext(ProviderContext);
    const navigate = useNavigate();
    const sideButtons = useRef([]);
    
    return ( 
        <nav className="sidebar" style={{ width: isSidebarShorten ? '60px' : '180px' }}>
            <button ref={el => sideButtons.current[0] = el} 
                onClick={() => {
                    
                    navigate('/Provider/Dashboard');
                }}>
                <img src="/icons/dashboard.png" className="icons" style={{left: isSidebarShorten ? '15px' : ''}} />
                {isSidebarShorten ? '' : 'Dashboard'}
            </button>
            <button ref={el => sideButtons.current[1] = el} 
                onClick={() => {
                
                navigate('/Provider/Services');
                }}>
                <img src="/icons/repair-tool.png" className="icons" style={{left: isSidebarShorten ? '15px' : ''}} />
                {isSidebarShorten ? '' : 'Services List'}
            </button>
            <button ref={el => sideButtons.current[2] = el} 
                onClick={() => {
                    
                    navigate('/Provider/Services-Offered');
                }}>
                <img src="/icons/services.png" className="icons" style={{left: isSidebarShorten ? '15px' : ''}} />
                {isSidebarShorten ? '' : 'Your Services'}
            </button>
            <button ref={el => sideButtons.current[3] = el} 
                onClick={() => {
                
                navigate('/Provider/Availability');
                }}>
                <img src="/icons/calendar.png" className="icons" style={{left: isSidebarShorten ? '15px' : ''}} />
                {isSidebarShorten ? '' : 'Availability'}
            </button>
            <button ref={el => sideButtons.current[4] = el} 
                onClick={() => {
                
                navigate('/Provider/Transactions');
                }}>
                <img src="/icons/transactions.png" className="icons" style={{left: isSidebarShorten ? '15px' : ''}} />
                {isSidebarShorten ? '' : 'Transactions'}
            </button>
        </nav>
        )
}