import { Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-100 shadow-md flex items-center justify-between p-4 z-50">
      <div className="flex items-center gap-6">
        <div>
          <Link to="/home">
            <img src="/delaware_navbaricon.png" alt="Logo Delaware" />
          </Link>
        </div>
        <Link to="/dashboard" className="text-black font-semibold flex items-center gap-1 hover:text-gray-600">
          Dashboard
        </Link>
        <Link to="/sites" className="text-red-500 font-semibold flex items-center gap-1 hover:text-red-400">
          ☰ Sites
        </Link>
        <Link to="/machines" className="text-black font-semibold flex items-center gap-1 hover:text-gray-600">
          Machines
        </Link>
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
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">2</span>
          </Link>
        </div>

        <Link 
          to="/login" 
          className="ml-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
        >
          Log in
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
