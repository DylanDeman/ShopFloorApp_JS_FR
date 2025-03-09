import TableRow from './../genericComponents/TableRow';

const SiteTable = ({ sites, onSortMachines, onSortId, sorteerVolgorde, sorteerVolgordeId, onShow, onEdit }) => {
  if (sites.length === 0) {
    return (
      <div className="flex justify-center items-center h-32">
        <h2 className="text-lg font-semibold text-gray-700">Er zijn geen sites beschikbaar.</h2>
      </div>
    );
  }

  return (
    <div className="md:overflow-x-auto overflow-x-auto">
      <table className="border-separate border-spacing-0 rounded-md border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
            <th className="border border-gray-300 px-4 md:py-2 select-none"></th>
            <th 
              className="border border-gray-300 px-4 md:py-2 cursor-pointer select-none"
              onClick={onSortId}
            >
              Nr.
              {sorteerVolgordeId === 'asc' ? ' 🔼' : sorteerVolgordeId === 'desc' ? ' 🔽' : ''}
            </th>
            <th className="border border-gray-300 px-4 md:py-2 select-none">Naam</th>
            <th className="border border-gray-300 px-4 md:py-2 select-none">Verantwoordelijke</th>
            <th 
              className="border border-gray-300 px-4 md:py-2 cursor-pointer select-none"
              onClick={onSortMachines}
            >
              Aantal machines
              {sorteerVolgorde === 'asc' ? ' 🔼' : sorteerVolgorde === 'desc' ? ' 🔽' : ''}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site) => (
            <TableRow
              key={site.id} 
              data={site} 
              columns={['id', 'naam', 'verantwoordelijke', 'aantalMachines']} 
              onShow={onShow} 
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SiteTable;