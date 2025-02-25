import Site from "./Site";

const SiteTable = ({ sites, onSort, sorteerVolgorde }) => {
  if (sites.length === 0) {
    return (
      <div className="flex justify-center items-center h-32">
        <h2 className="text-lg font-semibold text-gray-700">Er zijn geen sites beschikbaar.</h2>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-0 rounded-md border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
            <th className="border border-gray-300 px-4 md:py-2">Nr.</th>
            <th className="border border-gray-300 px-4 md:py-2">Naam</th>
            <th className="border border-gray-300 px-4 md:py-2">Verantwoordelijke</th>
            <th 
              className="border border-gray-300 px-4 md:py-2 cursor-pointer"
              onClick={onSort}
            >
              Aantal machines
              {sorteerVolgorde === "asc" ? " 🔼" : sorteerVolgorde === "desc" ? " 🔽" : ""}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site) => (
            <Site key={site.id} {...site} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SiteTable;
