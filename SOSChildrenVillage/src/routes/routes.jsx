import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/Admin/AdminLayout';
import AdminDashboard from '../pages/Admin/Dashboard/AdminDashboard';
import UserManagement from '../pages/Admin/User/UserManagement';
import HouseManagement from '../pages/Admin/Houses/HouseManagement';
import ChildManagement from '../pages/Admin/Child/ChildrenManagement';
import HomePages from '../pages/Home/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/admin" replace />,
    element: <Navigate to="/home" replace />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: '',
        element: <AdminDashboard />,
      },
      {
        path: 'user-management',
        element: <UserManagement />,
      },
      {
        path: 'house-management',
        element: <HouseManagement />,
      },
      {
        path: 'child-management',
        element: <ChildManagement />,
      },
    ],
  },
  {
    path: '/home',
    element: <HomePages />,

  },
  {
    path: '*',
    element: <Navigate to="/home" replace />,
  },
]);

export default router;