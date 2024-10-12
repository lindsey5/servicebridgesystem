import { Outlet } from "react-router-dom";
import ClientHeader from '../Pages/ClientPage/ClientHeader.jsx';
import { ClientContextProvider } from "../Context/ClientContext.jsx";
import { RecipientContextProvider } from "../Context/RecipientContext.jsx";

export default function ClientLayout() {
  return (
      <ClientContextProvider>
        <RecipientContextProvider>
          <ClientHeader />
          <main>
            <Outlet />
          </main>
        </RecipientContextProvider>
      </ClientContextProvider>
  );
}
