import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/Admin/AdminLayout';
import AdminDashboard from '../pages/Admin/Dashboard/AdminDashboard';
import UserManagement from '../pages/Admin/User/UserManagement';
import HouseManagement from '../pages/Admin/Houses/HouseManagement';
import ChildManagement from '../pages/Admin/Child/ChildrenManagement';
import HomePages from '../pages/Home/HomePage';
import Login from '../pages/Authenication/Login';
import UserDetail from '../pages/User/UserProfile';
import Register from '../pages/Authenication/Register';
import Donate from '../pages/Donates/DonatePage';
import { element } from 'prop-types';
import PaymentReturnPage from '../pages/Donates/PaymentReturnPage';
import EditUserProfile from '../pages/User/EditUserProfile';
import EventDetailPage from '../pages/EventPage/EventDetailPage';

// Corrected router
const router = createBrowserRouter([
  {
    path: '/',  // Redirect root path
    element: <Navigate to="/home" replace />,  // Redirect root to login (you can change to '/home' if needed)
  },
  {
    path: '/admin',  // Admin layout with nested routes
    element: <AdminLayout />,
    children: [
      {
        path: '',  // Admin dashboard as default
        element: <AdminDashboard />,
      },
      {
        path: 'user-management',  // Admin User management
        element: <UserManagement />,
      },
      {
        path: 'house-management',  // Admin House management
        element: <HouseManagement />,
      },
      {
        path: 'child-management',  // Admin Child management
        element: <ChildManagement />,
      },
    ],
  },
  {
    path: '/home',  // Home page route
    element: <HomePages />,
  },
  {
    path: '/login',  // Login page route
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/userdetail',  // User detail route
    element: <UserDetail />,
  },
  {
    path: '/edituserprofile',  // User detail route
    element: <EditUserProfile />,
  },
  {
    path: '/eventdetail/:id',
    element: <EventDetailPage />,
  },
  {
    path: '/donate',
    element: <Donate />,
  },
  {
    path: '/paymentreturn',
    element: <PaymentReturnPage/>
  },
  {
    path: '*',  // Fallback route for unknown paths
    element: <Navigate to="/home" replace />,
  },
]);

export default router;
