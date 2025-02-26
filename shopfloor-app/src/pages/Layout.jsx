import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Layout() {
  return (
    <div className='pt-26'>
      <Navbar />
      <div className='container mx-auto px-4'>
        <Outlet />
      </div>
      <ScrollRestoration />
    </div>
  );
}