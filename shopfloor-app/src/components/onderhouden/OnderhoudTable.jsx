import OnderhoudRow from './OnderhoudRow';

export default function OnderhoudTable({
  machine,
  onderhouden, 
  show, 
  onSort, 
  sortConfig, 
}) {
  const renderSortableHeader = (label, field) => (
    <th 
      className="border border-gray-300 px-2 sm:px-4 py-1 sm:py-2 cursor-pointer select-none"
      onClick={() => onSort(field)}
      data-cy={`column-${field}`}
    >
      <span className="text-xs sm:text-sm md:text-base">{label}</span>
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
