import MachineOnderhoudenRow from './MachineOnderhoudenRow';

const MachineTable = ({ 
  machines, 
  showOnderhouden, 
  onShow,
  onSort, 
  sortConfig, 
}) => {
  if (machines.length === 0) {
    return (
      <div className="flex justify-center items-center h-32" data-cy="no-machines-message">
        <h2 className="text-lg font-semibold text-gray-700">Er zijn geen machines beschikbaar.</h2>
      </div>
    );
  }

  // Helper functie om de header van de tabel te renderen met een juiste icoontje
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
    <div className="overflow-x-auto" data-cy="machine-table-container">
      <table className="border-separate border-spacing-0 rounded-md border border-gray-300 w-full" >
        <thead>
          <tr className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
            {renderSortableHeader('Nr.', 'id')}
            {renderSortableHeader('Locatie', 'locatie')}
            {renderSortableHeader('Status', 'status')}
            {renderSortableHeader('Productiestatus', 'productie_status')}
            {renderSortableHeader('Technieker', 'technieker')}
            <th className="border border-gray-300 px-4 md:py-2"></th>
          </tr>
        </thead>
        <tbody data-cy="site-details">
          {machines.map((machine) => (
            <MachineOnderhoudenRow
              key={machine.id} 
              data={machine} 
              columns={['id', 'locatie', 'status', 'productie_status', 'technieker']} 
              data-cy={`machine-row-${machine.id}`}
              showOnderhouden={showOnderhouden}
              onShow={onShow}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MachineTable;