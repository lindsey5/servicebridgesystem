import { useState, useEffect } from 'react';

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch(url);
                const result = await response.json();
                if(response.ok) {
                    setData(result);
                    setError(false);
                }
            }catch(err){
                setError(true);
            }finally{
                setLoading(false);
            }
        };
        fetchData();
    }, [url]);

    return { data, error, loading }; 
};

export default useFetch;
