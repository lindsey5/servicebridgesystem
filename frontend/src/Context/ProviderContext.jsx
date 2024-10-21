import { createContext, useEffect, useState } from "react"
import useFetch from "../hooks/useFetch";

export const  ProviderContext = createContext();

export const ProviderContextProvider = ({children}) => {
    const [fullname, setFullname] = useState(null);
    const [hideSideBar, setHideSideBar] = useState(false);
    
    const {data: ProviderData} = useFetch('/api/provider');

    useEffect(()=>{
        if(ProviderData){
            const fullname = ProviderData.provider.firstname + ' ' + ProviderData.provider.lastname;
            setFullname(fullname);
        }
    }, [ProviderData])

    return (
        <ProviderContext.Provider value={{ fullname, hideSideBar, setHideSideBar }}>
            {children}
        </ProviderContext.Provider>
    )
}