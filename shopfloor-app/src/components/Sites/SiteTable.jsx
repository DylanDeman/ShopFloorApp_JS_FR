import Site from "./Site";

const SiteTable = ({ sites }) => {
  if (sites.length === 0) {
    return (
      <div className="flex justify-center items-center h-32">
        <h2 className="text-lg font-semibold text-gray-700">Er zijn geen sites beschikbaar.</h2>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse border border-gray-300 bg-white shadow-md rounded-lg ml-50">
        <thead>
          <tr className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
            <th className="border border-gray-300 px-4 py-2">Nr.</th>
            <th className="border border-gray-300 px-4 py-2">Naam</th>
            <th className="border border-gray-300 px-4 py-2">Locatie</th>
            <th className="border border-gray-300 px-4 py-2">Omschrijving</th>
            <th className="border border-gray-300 px-4 py-2">Gezondheidsniveau</th>
            <th className="border border-gray-300 px-4 py-2">Onderhoudsniveau</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site) => (
            <Site key={site.nr} {...site} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SiteTable;