import { Outlet } from "react-router-dom";
import ProviderHeader from "../Pages/ProviderPage/ProviderHeader.jsx";
import { ProviderContextProvider } from "../Context/ProviderContext.jsx";
import ProviderSideBar from "../Pages/ProviderPage/ProviderSideBar.jsx";

export default function ProviderLayout() {

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
