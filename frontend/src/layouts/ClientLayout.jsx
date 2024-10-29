import { Outlet } from "react-router-dom";
import ClientHeader from '../Pages/ClientPage/ClientHeader.jsx';
import { ClientContextProvider } from "../Context/ClientContext.jsx";

export default function ClientLayout() {
  return (
      <ClientContextProvider>
          <ClientHeader />
          <main>
            <Outlet />
          </main>
      </ClientContextProvider>
  );
}
