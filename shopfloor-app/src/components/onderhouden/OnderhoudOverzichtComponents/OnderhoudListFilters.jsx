export default function OnderhoudListFilters({
  statusFilter,
  techniekerFilter,
  uniqueStatuses,
  uniqueTechniekers,
  onFilterChange,
  onResetFilters,
}) {
  return (
    <div className="mb-6 p-4 rounded-md border border-gray-200">
      <div className="flex flex-wrap items-center">
        <h3 className="text-gray-700 font-medium mb-3 w-full">Filters</h3>
        <div className="flex flex-wrap gap-4">
          {/* Status filter */}
          <div className="mb-2 md:mb-0">
            <label htmlFor="status-filter" className="block text-sm text-gray-600 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={onFilterChange.status}
              className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-auto"
              data-cy="status_filter"
            >
              <option value="">Alle statussen</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          
          {/* Technieker filter */}
          <div className="mb-2 md:mb-0">
            <label htmlFor="technieker-filter" className="block text-sm text-gray-600 mb-1">
              Technieker
            </label>
            <select
              id="technieker-filter"
              value={techniekerFilter}
              onChange={onFilterChange.technieker}
              className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-auto"
              data-cy="onderhoud_technieker_filter"
            >
              <option value="">Alle techniekers</option>
              {uniqueTechniekers.map((technieker) => (
                <option key={technieker} value={technieker}>
                  {technieker}
                </option>
              ))}
            </select>
          </div>
          
          {/* Reset filters button */}
          <div className="flex items-end mb-2 md:mb-0">
            <button
              onClick={onResetFilters}
              className="hover:bg-red-700 bg-red-500 text-white py-2 px-4 rounded-md 
              hover:cursor-pointer transition-all duration-300"
              data-cy="reset_filters"
            >
              Filters wissen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}