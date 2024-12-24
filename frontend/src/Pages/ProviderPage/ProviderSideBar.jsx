import { useNavigate } from "react-router-dom"
import '../styles/sidebar.css'
import { useContext, useState, useEffect } from "react"
import { ProviderContext } from "../../Context/ProviderContext";
import useFetch from "../../hooks/useFetch";

export default function ProviderSideBar () {
    const { hideSideBar, setHideSideBar } = useContext(ProviderContext);
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState(parseInt(localStorage.getItem('activeButton')) || 1);
    const { data } = useFetch('/api/transactions/requested/provider')

    const handleButtonClick = (buttonIndex) => {
        setActiveButton(buttonIndex);
        localStorage.setItem('activeButton', buttonIndex);

        if(window.innerWidth <= 840){
            setHideSideBar(false);
        }
    };
    
    return ( 
        <nav
            className="sidebar"
            style={
                window.innerWidth <= 840
                ? { display: hideSideBar ? 'flex' : 'none' } 
                : { width: hideSideBar ? '60px' : '180px' }
            }
        >
            <button className={`sidebar-button ${activeButton === 1 ? 'active' : ''}`}
                onClick={() =>{
                    navigate('/Provider/Dashboard');
                    handleButtonClick(1);
                }}>
                    <img src="/icons/dashboard.png" className="icons" style={{left: hideSideBar ? '15px' : ''}} />
                    {window.innerWidth <= 840 ? 'Dashboard' : (hideSideBar ? '' : 'Dashboard')}
            </button>
            <button className={`sidebar-button ${activeButton === 2 ? 'active' : ''}`}
                onClick={() => {
                    navigate('/Provider/Services');
                    handleButtonClick(2);
                }}>
                    <img src="/icons/repair-tool.png" className="icons" style={{left: hideSideBar ? '15px' : ''}} />
                    {window.innerWidth <= 840 ? 'Services' : (hideSideBar ? '' : 'Services')}
            </button>
            <button className={`sidebar-button ${activeButton === 3 ? 'active' : ''}`}
                onClick={() => {
                    navigate('/Provider/Services-Offered');
                    handleButtonClick(3);
                }}>
                    <img src="/icons/services.png" className="icons" style={{left: hideSideBar ? '15px' : ''}} />
                    {window.innerWidth <= 840 ? 'Your Services' : (hideSideBar ? '' : 'Your Services')}
            </button>
            <button className={`sidebar-button ${activeButton === 4 ? 'active' : ''}`}
                onClick={() => {
                    navigate('/Provider/Availability');
                    handleButtonClick(4);
                }}>
                    <img src="/icons/calendar.png" className="icons" style={{left: hideSideBar ? '15px' : ''}} />
                    {window.innerWidth <= 840 ? 'Availability' : (hideSideBar ? '' : 'Availability')}
            </button>
            <button className={`sidebar-button ${activeButton === 5 ? 'active' : ''}`}
                onClick={() => {
                    navigate('/Provider/Transactions');
                    handleButtonClick(5);
                }}>
                    <img src="/icons/transactions.png" className="icons" style={{left: hideSideBar ? '15px' : ''}} />
                    {window.innerWidth <= 840 ? 'Transactions' : (hideSideBar ? '' : 'Transactions') }
                    {data?.length > 0 &&  <span>{data.length}</span>}
            </button>
            <button className={`sidebar-button ${activeButton === 6 ? 'active' : ''}`}
                onClick={() => {
                    navigate('/Provider/Reviews');
                    handleButtonClick(6);
                }}>
                    <img src="/icons/like.png" className="icons" style={{left: hideSideBar ? '15px' : ''}} />
                    {window.innerWidth <= 840 ? 'Reviews' : (hideSideBar ? '' : 'Reviews') }
            </button>
        </nav>
        )
}