import { useNavigate } from "react-router-dom"
import '../styles/sidebar.css'
import { useContext, useState, useEffect } from "react"
import { ProviderContext } from "../../Context/ProviderContext";

export default function ProviderSideBar () {
    const { isSidebarShorten } = useContext(ProviderContext);
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState(1);

      // Load the active button state from localStorage when the component mounts
    useEffect(() => {
        const savedActiveButton = localStorage.getItem('activeButton');
        if (savedActiveButton) {
            setActiveButton(parseInt(savedActiveButton));
        }
    }, []);

    const handleButtonClick = (buttonIndex) => {
        setActiveButton(buttonIndex);
        localStorage.setItem('activeButton', buttonIndex);
    };
    
    return ( 
        <nav className="sidebar" style={{ width: isSidebarShorten ? '60px' : '180px' }}>
            <button className={`sidebar-button ${activeButton === 1 ? 'active' : ''}`}
                onClick={() =>{
                    navigate('/Provider/Dashboard');
                    handleButtonClick(1);
                }}>
                    <img src="/icons/dashboard.png" className="icons" style={{left: isSidebarShorten ? '15px' : ''}} />
                    {isSidebarShorten ? '' : 'Dashboard'}
            </button>
            <button className={`sidebar-button ${activeButton === 2 ? 'active' : ''}`}
                onClick={() => {
                    navigate('/Provider/Services');
                    handleButtonClick(2);
                }}>
                    <img src="/icons/repair-tool.png" className="icons" style={{left: isSidebarShorten ? '15px' : ''}} />
                    {isSidebarShorten ? '' : 'Services List'}
            </button>
            <button className={`sidebar-button ${activeButton === 3 ? 'active' : ''}`}
                onClick={() => {
                    navigate('/Provider/Services-Offered');
                    handleButtonClick(3);
                }}>
                    <img src="/icons/services.png" className="icons" style={{left: isSidebarShorten ? '15px' : ''}} />
                    {isSidebarShorten ? '' : 'Your Services'}
            </button>
            <button className={`sidebar-button ${activeButton === 4 ? 'active' : ''}`}
                onClick={() => {
                    navigate('/Provider/Availability');
                    handleButtonClick(4);
                }}>
                    <img src="/icons/calendar.png" className="icons" style={{left: isSidebarShorten ? '15px' : ''}} />
                    {isSidebarShorten ? '' : 'Availability'}
            </button>
            <button className={`sidebar-button ${activeButton === 5 ? 'active' : ''}`}
                onClick={() => {
                    navigate('/Provider/Transactions');
                    handleButtonClick(5);
                }}>
                    <img src="/icons/transactions.png" className="icons" style={{left: isSidebarShorten ? '15px' : ''}} />
                    {isSidebarShorten ? '' : 'Transactions'}
            </button>
        </nav>
        )
}