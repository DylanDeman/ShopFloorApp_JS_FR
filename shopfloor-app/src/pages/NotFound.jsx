const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-30 text-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Pagina niet gevonden</h1>
      <p className="text-lg text-gray-600 mb-6">Oeps! De pagina die je zoekt bestaat niet.</p>
      <a
        href="/"
        className="px-5 py-3 bg-red-500 text-white rounded-lg 
        shadow-md hover:bg-red-700 transition transform duration-300"
      >
        Ga terug naar home
      </a>
    </div>
  );
};

export default NotFound;
