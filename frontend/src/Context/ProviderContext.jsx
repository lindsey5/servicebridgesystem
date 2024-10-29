import { createContext, useEffect, useState } from "react"
import useFetch from "../hooks/useFetch";

// Create a context for the provider data
export const ProviderContext = createContext();

export const ProviderContextProvider = ({children}) => {
    // State to store the provider's full name and sidebar visibility toggle
    const [fullname, setFullname] = useState(null);
    const [hideSideBar, setHideSideBar] = useState(false);
    const [id, setId] = useState();
    const [rating, setRating] = useState();
    
    // Fetch provider data using a custom hook
    const { data: ProviderData } = useFetch('/api/provider');

    // Effect to set the provider's full name once the provider data is fetched
    useEffect(() => {
        if (ProviderData) {
            // Concatenate the provider's first and last name and update state
            const fullname = ProviderData.firstname + ' ' + ProviderData.lastname;
            setId(ProviderData.id);
            setFullname(fullname);
            setRating(ProviderData.rating);
        }
    }, [ProviderData]); // Re-run the effect when ProviderData changes

    return (
        // Provide the fullname, hideSideBar state, and setHideSideBar function to context consumers
        <ProviderContext.Provider value={{ id,rating, fullname, hideSideBar, setHideSideBar }}>
            {children}
        </ProviderContext.Provider>
    );
}
