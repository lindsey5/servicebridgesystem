import { Outlet } from "react-router-dom";
import ProviderHeader from "../Pages/ProviderPage/ProviderHeader.jsx";
import { ProviderContextProvider, ProviderContext } from "../Context/ProviderContext.jsx";
import ProviderSideBar from "../Pages/ProviderPage/ProviderSideBar.jsx";
import { RecipientContextProvider } from "../Context/RecipientContext.jsx";

export default function ProviderLayout() {

  return (
    <ProviderContextProvider>
      <RecipientContextProvider>
        <ProviderHeader />
        <ProviderSideBar />
            <main>
              <Outlet />
            </main>
      </RecipientContextProvider>
    </ProviderContextProvider>
  );
}
