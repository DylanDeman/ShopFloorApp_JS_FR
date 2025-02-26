import { Link, useLocation } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';

const Navbar = () => {
  const location = useLocation();

  const navbarItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Sites', path: '/sites' },
    { name: 'Machines', path: '/machines' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-100 shadow-md flex items-center justify-between p-4 z-50">
      <div className="flex items-center gap-6">
        <div className="md:px-10 md:pr-20">
          <Link to="/home">
            <img src="/delaware_navbaricon.png" alt="Logo Delaware" />
          </Link>
        </div>

        {navbarItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`font-semibold flex items-center gap-1 ${
              location.pathname === item.path ? 'text-red-500 hover:text-red-400' : 'text-black hover:text-gray-600'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-black font-semibold">John Doe</p>
          <p className="text-red-500 text-sm">Manager</p>
          {/* TODO --> Naam en functie aanvullen op basis van ingelogde user */}
        </div>
        <div className="relative">
          <Link to="/notificaties">
            <FiBell className="w-6 h-6 text-black hover:text-gray-600" />
            <span 
              className="absolute -top-1 -right-1 bg-red-500 
            text-white text-xs font-bold w-5 h-5 
              flex items-center justify-center rounded-full"
            >
              2
            </span>
          </Link>
        </div>

        <Link 
          to="/login" 
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
