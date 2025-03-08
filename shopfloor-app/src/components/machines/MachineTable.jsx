import TableRow from './../genericComponents/TableRow';

const MachineTable = ({ machines, onSort, sorteerVolgorde }) => {
  if (machines.length === 0) {
    return (
      <div className="flex justify-center items-center h-32" data-cy="no-machines-message">
        <h2 className="text-lg font-semibold text-gray-700">Er zijn geen machines beschikbaar.</h2>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" data-cy="machine-table-container">
      <table className="border-separate border-spacing-0 rounded-md border border-gray-300 w-full" >
        <thead>
          <tr className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
            <th className="border border-gray-300 px-4 md:py-2">Nr.</th>
            <th className="border border-gray-300 px-4 md:py-2">Locatie</th>
            <th 
              className="border border-gray-300 px-4 md:py-2 cursor-pointer"
              onClick={onSort}
              data-cy="column-status"
            >
              Status
              {sorteerVolgorde === 'asc' ? ' 🔼' : sorteerVolgorde === 'desc' ? ' 🔽' : ''}
            </th>
            <th className="border border-gray-300 px-4 md:py-2">ProductieStatus</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {machines.map((machine) => (
            <TableRow 
              key={machine.id} 
              data={machine} 
              columns={['id', 'locatie', 'status', 'productieStatus']} 
              data-cy={`machine-row-${machine.id}`}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MachineTable;
