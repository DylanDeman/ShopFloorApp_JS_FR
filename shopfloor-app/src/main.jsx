import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import NotFound from './pages/NotFound.jsx'
import Layout from './pages/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Sites from './pages/Sites.jsx'
import Machines from './pages/Machines.jsx'
import Notificaties from './pages/Notificaties.jsx'
import Login from './pages/Login.jsx'

import { AuthProvider } from './contexts/Auth.context'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Navigate replace to='/home' />,
      },
      {
        path: '/home',
        element: <App />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/sites',
        element: <Sites />,
      },
      {
        path: '/machines',
        element: <Machines />,
      },
      {
        path: '/notificaties',
        element: <Notificaties />,
      },
      {
        path: '*', element: <NotFound />
      },
      {
        path: '/login',
        element: <Login />
      },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
