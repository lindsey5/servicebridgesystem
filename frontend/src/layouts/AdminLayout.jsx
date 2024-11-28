import { Outlet } from "react-router-dom";
import AdminSideBar from "../Pages/AdminPage/AdminSidebar";
import { AdminContextProvider } from "../Context/AdminContext";
import AdminHeader from "../Pages/AdminPage/AdminHeader";


export default function AdminLayout() {

  return (
    <AdminContextProvider>
        <AdminHeader />
        <AdminSideBar />
        <main>
            <Outlet />
        </main>
    </AdminContextProvider>
  );
}
