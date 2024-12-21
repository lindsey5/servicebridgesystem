import './App.css';
import Home from './Pages/HomePage/Home.jsx';
import ClientLogin from './Pages/AuthPages/ClientLogin.jsx';
import ProviderLogin from './Pages/AuthPages/ProviderLogin.jsx';
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom';
import ClientHome from './Pages/ClientPage/ClientHome.jsx';
import ProviderDashboard from './Pages/ProviderPage/ProviderDashboard.jsx';
import {PublicRoutes, ClientRoutes, ProviderRoutes} from './routes/routes.jsx';
import ClientLayout from './layouts/ClientLayout.jsx';
import ProviderLayout from './layouts/ProviderLayout.jsx';
import ClientSearchResult from './Pages/ClientPage/ClientSearchResult.jsx';
import Booking from './Pages/ClientPage/Booking.jsx';
import ClientTransactions from './Pages/ClientPage/ClientTransactions.jsx';
import TransactionSummary from './Pages/ClientPage/TransactionSummary.jsx';
import ProviderTransactions from './Pages/ProviderPage/ProviderTransactions.jsx';
import ProviderServices from './Pages/ProviderPage/ProviderServices.jsx';
import ProviderServicesOffered from './Pages/ProviderPage/ProviderServicesOffered.jsx';
import Availability from './Pages/ProviderPage/Availability.jsx';
import Messages from './Pages/Components/Messages/Messages.jsx';
import Services from './Pages/Components/Services/Services.jsx';
import ClientSignup from './Pages/AuthPages/ClientSignup.jsx';
import ClientAccountSettings from './Pages/ClientPage/ClientAccountSetting.jsx';
import ProviderAccountSettings from './Pages/ProviderPage/ProviderAccountSettings.jsx'
import ProviderReviews from './Pages/ProviderPage/ProviderReviews.jsx'
import ViewReviews from './Pages/ClientPage/ViewReviews.jsx';
import { RecipientContextProvider } from './Context/RecipientContext.jsx';
import ProviderSignup from './Pages/AuthPages/ProviderSignup.jsx';
import ChatBot from './Pages/Components/ChatBot.jsx/ChatBot.jsx';
import AdminLogin from './Pages/AuthPages/AdminLogin.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import AdminDashboard from './Pages/AdminPage/AdminDashboard.jsx';
import AdminServices from './Pages/AdminPage/AdminServices.jsx';
import AdminCategories from './Pages/AdminPage/AdminCategories.jsx';
import CompletedTransaction from './Pages/Components/Transactions/CompletedTransaction.jsx';

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<PublicRoutes/>}>
          <Route path="/" element={<Home />} />
          <Route path="Provider/Login" element={<ProviderLogin />} />
          <Route path="Client/Login" element={<ClientLogin />} />
          <Route path='Admin/Login' element={<AdminLogin />} />
          <Route path='Client/Signup' element={<ClientSignup />}/>
          <Route path='Provider/Signup' element={<ProviderSignup />}/>
        </Route>

        <Route path='/Admin/' element={<AdminLayout />}>
          <Route path='Dashboard' element={<AdminDashboard />} />
          <Route path='Services' element={<AdminServices />}/>
          <Route path='Categories' element={<AdminCategories />} />
        </Route>
  
        <Route path="/Client/" element={<ClientLayout />}>
          <Route element={<ClientRoutes />}>
            <Route path="Home" element={<ClientHome />} />
            <Route path="Search/Result" element={<ClientSearchResult />}/>
            <Route path="Transactions" element={<ClientTransactions />}/>
            <Route path='Messages' element={<Messages />}/>
            <Route path='Services' element={<Services />}/>
            <Route path='Account' element={<ClientAccountSettings />}/>
          </Route>
        </Route>
  
        <Route path="/Client/">
          <Route element={<ClientRoutes />}>
            <Route path="booking" element={<Booking />}/>
            <Route path='Transaction/Summary' element={<TransactionSummary/>} />
          </Route>
        </Route>

        <Route path='/transaction/completed' element={<CompletedTransaction />}/>
        
        <Route path='/Provider/' element={<ProviderLayout />}>
          <Route element={<ProviderRoutes />}>
            <Route path="Dashboard" element={<ProviderDashboard />} />
            <Route path='Transactions' element={<ProviderTransactions />} />
            <Route path='Services' element={<ProviderServices />}/>
            <Route path='Services-Offered' element={<ProviderServicesOffered /> } />
            <Route path='Availability' element={<Availability />} />
            <Route path='Messages' element={<Messages />}/>
            <Route path='Account' element={<ProviderAccountSettings />} />
            <Route path='Reviews' element={<ProviderReviews />}/>
          </Route>
        </Route>

        <Route path="/View/Reviews" element={<ViewReviews />} />
        <Route path="*" element={<Navigate to="/" />} />
      </>
    )
  );  

  return (
    <RecipientContextProvider>
      <RouterProvider router={router} />
      <ChatBot />
    </RecipientContextProvider>

  );
}
