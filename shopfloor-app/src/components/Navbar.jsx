import { Link, useLocation } from 'react-router-dom';
import AsyncData from './AsyncData';
import { getAll } from '../api/index';
import NotificatieNavbar from './Notificaties/NotificatiesNavbar';
import useSWR from 'swr';
import { useAuth } from '../contexts/auth';

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const volledigeNaam = user ? user.voornaam + ' ' + user.naam : null;
  const functie = user ? user.rol.charAt(0).toUpperCase() + user.rol.slice(1).toLowerCase() : null;

  const {
    data: notificaties,
    loading: notificatiesLoading,
    error: notificatiesError,
  } = useSWR('notificaties', getAll);

  const navbarItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Sites', path: '/sites' },
    { name: 'Machines', path: '/machines_onderhouden' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-100 shadow-md 
    max-sm:flex-col max-sm:items-center flex items-center justify-between p-4 z-50">
      <div className="flex items-center gap-6">
        <div className="md:px-10 md:pr-20">
          <Link to="/dashboard">
            <img src="/delaware_navbaricon.png" alt="Logo Delaware" />
          </Link>
        </div>

        {navbarItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`font-semibold flex items-center gap-1 ${location.pathname === item.path ?
              'text-red-500 hover:text-red-400' : 'text-black hover:text-gray-600'}`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-black font-semibold">{volledigeNaam}</p>
          <p className="text-red-500 text-sm">{functie}</p>
        </div>
        <div className="relative">
          <AsyncData loading={notificatiesLoading} error={notificatiesError}>
            <NotificatieNavbar notificaties={notificaties} />
          </AsyncData>
        </div>

        <Link
          to="/logout"
          className="ml-4 px-4 py-2 bg-red-500 text-white 
          font-semibold rounded-lg hover:bg-red-600 transition duration-300"
        >
          Uitloggen
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
