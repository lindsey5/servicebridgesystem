import { useState, useEffect } from 'react';

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const runInterval = () =>{
        setInterval(() => {
            setLoading(false);
        }, 2000);
    }

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch(url);
                const result = await response.json();
                if(response.ok) {
                    setData(result);
                    setError(false);
                    runInterval();
                }else {
                    runInterval();
                    setError(true);
                }
            }catch(err){
                runInterval();
                setError(true);
            }
        };
        fetchData();
    }, [url]);
    return { data, error }; 
};

export default useFetch;
