import { createContext, useState } from "react";


export const AdminContext = createContext();

export const AdminContextProvider = ({children}) => {
    const [hideSideBar, setHideSideBar] = useState(false);

    return(
        <AdminContext.Provider value={{hideSideBar, setHideSideBar}}>
            {children}
        </AdminContext.Provider>
    )
}