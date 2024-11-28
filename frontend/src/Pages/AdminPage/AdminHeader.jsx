import '../styles/header.css';
import { useContext } from 'react';
import { AdminContext } from '../../Context/AdminContext';

const AdminHeader = () =>{
    const { setHideSideBar } =  useContext(AdminContext);

    return (
    <header className='provider-header'>
        <div className="header-left-div">
            <button className="sidebar-toggle-btn" onClick={() => setHideSideBar(prev => !prev)}>
                <img src="/icons/menu.png" alt="menu" />
            </button>
            <h1 id="title" onClick={()=> navigate('/Admin/Dashboard')}>Hustle</h1>
        </div>
    </header>
    )
}

export default AdminHeader;