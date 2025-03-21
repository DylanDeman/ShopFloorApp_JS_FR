import OnderhoudRow from './OnderhoudRow';

export default function OnderhoudTable({
  machine,
  onderhouden, 
  show, 
  onSort, 
  sortConfig, 
}) {
  
  if (onderhouden.length === 0) {
    return (
      <div className="flex justify-center items-center h-32" data-cy="no-onderhouden-message">
        <h2 className="text-lg font-semibold text-gray-700">Er zijn geen onderhoudsbeurten beschikbaar.</h2>
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
    <div className="overflow-x-auto" data-cy="onderhouden-table-container">
      <table className="min-w-full border-separate border-spacing-0 rounded-md border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-gray-700 uppercase text-xs sm:text-sm md:text-base font-semibold">
            {renderSortableHeader('Nr.', 'id')}
            {renderSortableHeader('Starttijdstip', 'starttijdstip')}
            {renderSortableHeader('Eindtijdstip', 'eindtijdstip')}
            {renderSortableHeader('Naam technieker', 'technieker')}
            {renderSortableHeader('Reden', 'reden')}
            {renderSortableHeader('Opmerkingen', 'opmerkingen')}
            {renderSortableHeader('Onderhoudsrapport', 'onderhoudsrapport')}
            {renderSortableHeader('Status', 'status')}
          </tr>
        </thead>
        <tbody data-cy="site-details">
          {onderhouden.map((onderhoud) => (
            <OnderhoudRow
              machine={machine}
              onShow={show}
              key={onderhoud.id} 
              data={onderhoud} 
              columns={[
                'id', 
                'starttijdstip', 
                'eindtijdstip', 
                'technieker', 
                'reden', 
                'opmerkingen',
                'onderhoudsrapport',
                'status', 
              ]} 
              data-cy={`onderhoud-row-${onderhoud.id}`}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
