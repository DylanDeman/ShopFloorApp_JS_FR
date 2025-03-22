// SiteListHeader.jsx
import Search from '../../genericComponents/Search';

export default function SiteListHeader({ zoekterm, onSearch, limit, onLimitChange }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between">
      {/* Search input */}
      <Search 
        value={zoekterm} 
        onChange={onSearch} 
        placeholder="Zoeken naar locatie, status, productiestatus, ..."
      />
      
      {/* Page size selector - niet zichtbaar op small screens */}
      <div className="hidden md:flex items-center mt-3 md:mt-0">
        <label htmlFor="page-size" className="mr-2 text-gray-700">
          Aantal sites per pagina:
        </label>
        <select
          id="page-size"
          value={limit}
          onChange={onLimitChange}
          className="border border-gray-300 rounded-md px-3 py-2"
          data-cy="sites_page_size"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
}