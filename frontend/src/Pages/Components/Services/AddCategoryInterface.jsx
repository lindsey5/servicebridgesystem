import { useState } from 'react';
import './AddCategoryStyle.css'
import { addCategory } from '../../../services/categoryService';

const AddCategoryInterface = ({close}) => {
    const [imgSrc, setImgSrc] = useState();
    const [icon, setIcon] = useState();
    const [category_name, setCategoryName] = useState('');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a FileReader to read the file as an ArrayBuffer
            const reader = new FileReader();
    
            // Set the image source for preview
            const previewReader = new FileReader();
            previewReader.onload = () => {
                setImgSrc(previewReader.result); // Set the image source to the loaded file
            };
            previewReader.readAsDataURL(file); // Read the file for the preview
    
            // Read the file as an ArrayBuffer
            reader.onloadend = () => {
                const arrayBuffer = reader.result;
    
                // Convert ArrayBuffer to a regular array
                const byteArray = new Uint8Array(arrayBuffer);
    
                setIcon(Array.from(byteArray));
            };
            reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
        }
    };


    return(
        <div className="category-modal">
            <div className='container'>
                <h1>Add Category</h1>
                <div>
                    <div className='icon-container'>
                     {imgSrc && <img src={imgSrc}/>}
                    </div>
                    <label htmlFor="fileInput">Upload a photo</label>
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        id='fileInput'
                    />
                </div>
                <p>Category Name</p>
                <input type="text" value={category_name} onChange={(e) => setCategoryName(e.target.value)} />
                <button 
                    className='create-category-btn' 
                    disabled={!(icon && category_name)}
                    onClick={() => addCategory(category_name, icon)}
                >Create New Category</button>
                <button onClick={close}>Close</button>
            </div>
        </div>
    )
}

export default AddCategoryInterface;