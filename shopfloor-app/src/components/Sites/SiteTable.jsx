import TableRow from './../genericComponents/TableRow';

const SiteTable = ({ 
  sites, 
  onShow, 
  onEdit, 
  onSort, 
  sortConfig, 
}) => {

  if (sites.length === 0) {
    return (
      <div className="flex justify-center items-center h-32">
        <h2 className="text-lg font-semibold text-gray-700">Er zijn geen sites beschikbaar.</h2>
      </div>
    );
  }

  const renderSortableHeader = (label, field) => (
    <th 
      className="border border-gray-300 px-4 md:py-2 cursor-pointer select-none"
      onClick={() => onSort(field)}
      data-cy={`column-${field}`}
    >
      {label}
      {sortConfig.field === field ? 
        (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽') : 
        ''}
    </th>
  );

  return (
    <div className="md:overflow-x-auto overflow-x-auto">
      <table className="border-separate border-spacing-0 rounded-md border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
            <th className="border border-gray-300 px-4 md:py-2 select-none"></th>
            {renderSortableHeader('Nr.', 'id')}
            {renderSortableHeader('Naam', 'naam')}
            {renderSortableHeader('Verantwoordelijke', 'verantwoordelijke')}
            {renderSortableHeader('Aantal machines', 'aantal_machines')}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site) => (
            <TableRow
              key={site.id} 
              data={site}
              columns={['id', 'naam', 'verantwoordelijke', 'aantal_machines']} 
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