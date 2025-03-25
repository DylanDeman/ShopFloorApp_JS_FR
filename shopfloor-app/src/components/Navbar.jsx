import { useState } from 'react';
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
    { name: 'Machines', path: '/machines' },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-gray-100 shadow-md 
        max-sm:flex-col max-sm:items-center flex items-center justify-between p-4 z-50">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <div className="md:px-10 md:pr-20">
              <Link to="/dashboard">
                <img src="/delaware_navbaricon.png" alt="Logo Delaware" width={40} />
              </Link>
            </div>

            <div className="hidden md:flex gap-6">
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
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-black font-semibold">{volledigeNaam}</p>
              <p className="text-red-500 text-sm">{functie}</p>
            </div>

            <button
              className="md:hidden text-2xl"
              onClick={toggleMenu}
            >
              ☰
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden flex flex-col items-center gap-4 mt-4 bg-gray-100 p-4 z-40 
          fixed top-16 left-0 w-full shadow-md">
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

            <Link
              to="/notificaties"
              className="text-black hover:text-gray-600"
            >
              Notificaties
            </Link>
          </div>
        )}

        <div className="hidden md:block relative">
          <AsyncData loading={notificatiesLoading} error={notificatiesError}>
            <NotificatieNavbar notificaties={notificaties} />
          </AsyncData>
        </div>

        <div className="hidden md:block">
          <Link
            to="/logout"
            className="ml-4 px-4 py-2 bg-red-500 text-white 
            font-semibold rounded-lg hover:bg-red-600 transition duration-300"
          >
            Uitloggen
          </Link>
        </div>
      </nav>

      <div className={`transition-all duration-300 ${isMenuOpen ? 'mt-30' : 'mt-1'}`}></div>
    </>
  );
};

export default Navbar;
