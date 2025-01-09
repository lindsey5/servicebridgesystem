import { useEffect, useState } from "react"
import './Portfolio.css'
import createImageSrc from "../../../utils/createImageSrc";
import defaultProfilePic from '../../../assets/user (1).png'

const createPortfolio = async (contents) => {
    try{
        const response = await fetch('/api/provider/portfolio',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({contents}), 
        })

        if(response.ok){
            window.location.reload()
        }

    }catch(err){
        console.log(err)
    }
}

const Portfolio = ({data, isProvider}) => {
    const [providerData, setProviderData] = useState();
    const [portfolios, setPortfolios] = useState([]);
    const [contents, setContents] = useState([]);
    
    const setData = async () => {
        try{
            const response = await fetch(`/api/provider/portfolio/${data.id}`)
            if(response.ok){
                const result = await response.json()
                setContents(result.map(item => item.content.data))
                setPortfolios(await Promise.all(result.map(async (portfolio) => {
                    return await createImageSrc(portfolio.content.data)
                })))

            }
        }catch(err){

        }

        setProviderData({...data, profile_pic: data.image?.data ? await createImageSrc(data.image.data) : defaultProfilePic})
    }

    useEffect(() => {
        document.title = 'Portfolio'
    }, [])

    useEffect(() => {
        console.log(data)
        if(data) setData()
    }, [data])

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a FileReader to read the file as an ArrayBuffer
            const reader = new FileReader();
    
            // Set the image source for preview
            const previewReader = new FileReader();
            previewReader.onload = () => {
                setPortfolios(prev => [...prev, previewReader.result]);
            };
            previewReader.readAsDataURL(file); // Read the file for the preview
    
            // Read the file as an ArrayBuffer
            reader.onloadend = () => {
                const arrayBuffer = reader.result;
    
                // Convert ArrayBuffer to a regular array
                const byteArray = new Uint8Array(arrayBuffer);
    
                // Set the profile_pic in your state as a regular array
                setContents(prev => [...prev, Array.from(byteArray)])
            };
    
            reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
        }
    };

    const removePortfolio = (index) => {
        setPortfolios(prev => prev.filter((portfolio, i) => i !== index))
        setContents(prev => prev.filter((portfolio, i) => i !== index))
    }

    return <div className="portfolio-page">
                <div className="provider-info-container">
                    <div>
                        <img src={providerData?.profile_pic} />
                        <div>
                            <h2>{providerData?.fullname}</h2>
                            <div className="location">
                                <img src="/icons/location.png"/>
                                <h4>{providerData?.location}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="bio-container">
                        <h3>Service Provider</h3>
                        {providerData?.bio || 'No bio'}
                        {isProvider && <a href='/Provider/Account'>Edit bio</a>}
                    </div>
                    <h3>Total Task Completed: {providerData?.total_task}</h3>
                </div>
                <div className="portfolio">
                    <div className="portfolio-header">
                        <h2>Portfolio</h2>
                        {isProvider && 
                            <>
                            <label htmlFor="fileInput">+</label>
                            <input 
                                type="file" 
                                onChange={handleFileChange} 
                                accept="image/*" 
                                id='fileInput'
                            />
                            </>
                        }
                    </div>
                    <div className="portfolio-container">
                    {portfolios.length > 0 ? portfolios.map((portfolio, index) => <div key={index} className="portfolio-img-container">
                        <img src={portfolio} />
                        {isProvider && <button onClick={() => removePortfolio(index)}>Remove</button>}
                    </div>) : <p>No items to display</p>}
                    </div>
                    {isProvider && <button onClick={() => createPortfolio(contents)}>Save Portfolio</button>}
                </div>
            </div>
}

export default Portfolio