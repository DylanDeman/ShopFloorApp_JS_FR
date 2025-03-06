import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './index.css';
import NotFound from './pages/NotFound.jsx';
import Layout from './pages/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Sites from './pages/sites/Sites';
import Machines from './pages/Machines.jsx';
import Notificaties from './pages/Notificaties/Notificaties.jsx';
import Login from './pages/Login.jsx';
import SiteDetail from './pages/sites/SiteDetail.jsx';
import SiteGrondplan from './pages/sites/SiteGrondplan.jsx';

import { AuthProvider } from './contexts/Auth.context';
import PrivateRoute from './components/PrivateRoute.jsx';
import Logout from './pages/Logout.jsx';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <Navigate replace to='/dashboard' />,
          },
        ],
      },
      
      {
        path: '/dashboard',
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
        ],
      },
      {
        path: '/sites',
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <Sites/>,
          },
          {
            path: ':id',
            element: <SiteDetail />,
          },
          {
            path: ':id/grondplan',
            element: <SiteGrondplan />,
          },
        ],
      },
      {
        path: '/machines',
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <Machines />,
          },
        ],
      },
      {
        path: '/notificaties',
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <Notificaties />,
          },
        ],
      },
      {
        path: '/logout', element: <Logout />,
      },
      {
        path: '*', element: <NotFound />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);