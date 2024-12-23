import { Outlet } from "react-router-dom";
import ClientHeader from '../Pages/ClientPage/ClientHeader.jsx';
import { ClientContextProvider } from "../Context/ClientContext.jsx";
import { useContext, useEffect } from "react";
import { SocketContext } from "../Context/SocketContext.jsx";
import io from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

export default function ClientLayout() {
  const { setSocket } = useContext(SocketContext);
  
  useEffect(() => {
    const socketConnection = io(URL, {
      withCredentials: true,
    });
    setSocket(socketConnection);
  },[])

  return (
      <ClientContextProvider>
          <ClientHeader />
          <main>
            <Outlet />
          </main>
      </ClientContextProvider>
  );
}
