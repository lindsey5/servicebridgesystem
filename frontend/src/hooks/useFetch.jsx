import { useState, useEffect } from 'react';

// Custom hook to fetch data from a given URL
const useFetch = (url) => {
    // State to store fetched data
    const [data, setData] = useState(null);
    // State to track if an error occurred during the fetch
    const [error, setError] = useState(false);
    // State to track the loading status of the fetch request
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Function to asynchronously fetch data
        const fetchData = async () => {
            // Set loading to true when starting the request
            setLoading(true);
            try {
                // Perform the fetch request to the provided URL
                const response = await fetch(url);
                // Parse the response data as JSON
                const result = await response.json();
                // Check if the response is successful
                if (response.ok) {
                    // Set the fetched data into the state
                    setData(result);
                    // Ensure error is set to false in case of a successful fetch
                    setError(false);
                } else {
                    // If the response is not OK, trigger error state
                    setError(true);
                }
            } catch (err) {
                // Handle any errors during the fetch operation
                setError(true);
            } finally {
                // Stop loading after the fetch request completes
                setLoading(false);
            }
        };

        // Call the fetchData function
        fetchData();
    }, [url]); // Re-run effect if the URL changes

    // Return the data, error, and loading status to be used by the component
    return { data, error, loading }; 
};

export default useFetch;

