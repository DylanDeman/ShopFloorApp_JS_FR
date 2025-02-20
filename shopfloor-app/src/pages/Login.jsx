const Login = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/login_achtergrond.svg')" }}>

      <div className="flex flex-col md:flex-row bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-11/12 max-w-4xl mt-15">
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-2xl font-bold mb-4">WELKOM!</h2>
          <p className="text-gray-600 text-sm mb-4">
            Nog geen account? Contacteer je verantwoordelijke, manager of een administrator!
          </p>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700">Email:</label>
              <input
                type="email"
                placeholder="Example@delaware.com"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="block text-gray-700">Wachtwoord:</label>
              <input
                type="password"
                placeholder="●●●●●●●●"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <p className="text-sm text-red-500 cursor-pointer">Wachtwoord vergeten?</p>
            <button
              onClick={console.log('Aanmeldknop ingedrukt!')}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
            >
              Aanmelden
            </button>
          </form>
        </div>

        <div className="hidden md:block w-1/2">
          <img
            src="/login_groepsfoto.jpg"
            alt="Groepsfoto"
            className="rounded-r-lg object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;