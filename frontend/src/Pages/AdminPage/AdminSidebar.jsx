import { useNavigate } from "react-router-dom"
import '../styles/sidebar.css'
import { useContext, useState, useEffect } from "react"
import { AdminContext } from "../../Context/AdminContext";

export default function AdminSideBar () {
    const { hideSideBar, setHideSideBar } = useContext(AdminContext);
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState(1);

    const logout = async () => {
        localStorage.removeItem('activeButton');
        window.location.href = '/logout';
    };

      // Load the active button state from localStorage when the component mounts
    useEffect(() => {
        const savedActiveButton = localStorage.getItem('activeButton');
        if (savedActiveButton) {
            setActiveButton(parseInt(savedActiveButton));
            switch(savedActiveButton){
                case '1':
                    navigate('/Admin/Dashboard');
                    break;
                case '2':
                    navigate('/Admin/Services');
                    break;
                case '3':
                    navigate('/Admin/Incomes');
                    break;
            }
        }
    }, []);

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
                    navigate('/Admin/Dashboard');
                    handleButtonClick(1);
                }}>
                    <img src="/icons/dashboard.png" className="icons" style={{left: hideSideBar ? '15px' : ''}} />
                    {window.innerWidth <= 840 ? 'Dashboard' : (hideSideBar ? '' : 'Dashboard')}
            </button>
            <button className={`sidebar-button ${activeButton === 2 ? 'active' : ''}`}
                onClick={() => {
                    navigate('/Admin/Services');
                    handleButtonClick(2);
                }}>
                    <img src="/icons/repair-tool.png" className="icons" style={{left: hideSideBar ? '15px' : ''}} />
                    {window.innerWidth <= 840 ? 'Services' : (hideSideBar ? '' : 'Services')}
            </button>
            <button className={`sidebar-button ${activeButton === 3 ? 'active' : ''}`}
                onClick={() => {
                    navigate('/Admin/Incomes');
                    handleButtonClick(3);
                }}>
                    <img src="/icons/pesos.png" className="icons" style={{left: hideSideBar ? '15px' : ''}} />
                    {window.innerWidth <= 840 ? 'Earnings' : (hideSideBar ? '' : 'Earnings')}
            </button>
            <button className={`sidebar-button ${activeButton === 3 ? 'active' : ''}`}
                onClick={() => {}}>
                    <img src="/icons/exit.png" className="icons" style={{left: hideSideBar ? '15px' : ''}} />
                    {window.innerWidth <= 840 ? 'Logout' : (hideSideBar ? '' : 'Logout')}
            </button>
        </nav>
        )
}