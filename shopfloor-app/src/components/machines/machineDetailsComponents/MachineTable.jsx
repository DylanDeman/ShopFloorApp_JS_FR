import TableRow from '../../genericComponents/TableRow';

const MachineTable = ({ 
  machines, 
  onShow, 
  onSort, 
  sortConfig, 
  onEdit,
}) => {
  if (machines.length === 0) {
    return (
      <div className="flex justify-center items-center h-32" data-cy="no-machines-message">
        <h2 className="text-lg font-semibold text-gray-700">Er zijn geen machines beschikbaar.</h2>
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
            {renderSortableHeader('Locatie', 'locatie')}
            {renderSortableHeader('Status', 'status')}
            {renderSortableHeader('Productiestatus', 'productie_status')}
            {renderSortableHeader('Technieker', 'technieker')}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {machines.map((machine) => (
            <TableRow
              key={machine.id} 
              data={machine}
              columns={['id', 'locatie', 'status', 'productie_status', 'technieker']} 
              data-cy={`machine-row-${machine.id}`}
              onShow={onShow} 
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MachineTable;
