import { useEffect, useState } from 'react';
import './TablePage.css';
import useFetch from '../../hooks/useFetch';
import AddCategoryInterface from '../Components/Services/AddCategoryInterface';
import { deleteCategory } from '../../services/categoryService';

const AdminCategories = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const { data } = useFetch('/api/category')

    useEffect(() => {
        if(data){
            setCategories(data)
        }
    },[data])

    useEffect(() => {
       if(data)  setCategories(data.filter(category => category.category_name.toLowerCase().includes(searchTerm.toLowerCase())))
    }, [searchTerm])

    useEffect(() => {
        document.title = "Services | Admin";
    }, []);

    return (
        <main className="table-page">
            {showAddCategory && <AddCategoryInterface close={() => setShowAddCategory(false)}/>}
            <h1>Categories</h1>
            <input type="search" placeholder='Search' onChange={(e) => setSearchTerm(e.target.value)}/>
            <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th>Category name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {categories.length > 0 && categories.map(category => 
                        <tr>
                            <td>{category.category_name}</td>
                            <td>
                                <button onClick={() => deleteCategory(category.category_name)}><img src="/icons/trash-bin.png" alt="" /></button>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            <button className='add-btn' onClick={() => setShowAddCategory(true)}>Add Category</button>
        </main>
    )
}

export default AdminCategories