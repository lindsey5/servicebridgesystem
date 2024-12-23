import { Outlet } from "react-router-dom";
import ProviderHeader from "../Pages/ProviderPage/ProviderHeader.jsx";
import { useContext, useEffect } from "react";
import { ProviderContextProvider } from "../Context/ProviderContext.jsx";
import ProviderSideBar from "../Pages/ProviderPage/ProviderSideBar.jsx";
import { SocketContext } from "../Context/SocketContext.jsx";
import io from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

export default function ProviderLayout() {
  const { setSocket } = useContext(SocketContext);
  
  useEffect(() => {
    const socketConnection = io(URL, {
      withCredentials: true,
    });
    setSocket(socketConnection);
  },[])

  return (
    <ProviderContextProvider>
        <ProviderHeader />
        <ProviderSideBar />
            <main>
              <Outlet />
            </main>
    </ProviderContextProvider>
  );
}
