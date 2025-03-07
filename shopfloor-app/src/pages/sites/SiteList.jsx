import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AsyncData from '../../components/AsyncData';
import SiteTable from '../../components/sites/SiteTable';
import { Pagination } from '../../components/genericComponents/Pagination';
import useSWR from 'swr';
import { getAll } from '../../api';
import Search from '../../components/genericComponents/Search';

export default function SiteList({ loading: parentLoading, error: parentError }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: paginatedData, loading, error } = useSWR(
    `sites?page=${currentPage}&limit=${limit}`, 
    getAll,
  );

  const sites = paginatedData?.items || [];
  const pagination = paginatedData;

  const [sorteerVolgorde, setSorteerVolgorde] = useState(null);
  const [zoekterm, setZoekterm] = useState('');

  const sorteerSites = (sites) => {
    if (!sorteerVolgorde) return sites;
    return [...sites].sort((a, b) =>
      sorteerVolgorde === 'asc' ? a.aantalMachines - b.aantalMachines : b.aantalMachines - a.aantalMachines,
    );
  };

  const handleSort = () => {
    setSorteerVolgorde((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleSearch = (e) => {
    setZoekterm(e.target.value);
  };

  const handleShow = (id) => {
    navigate(`/sites/${id}`);
  };

  const handleShowGrondplan = (id) => {
    navigate(`/sites/${id}/grondplan`);
  };
  
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1); 
  };

  const filteredSites = sites.filter((site) =>
    site.naam.toLowerCase().includes(zoekterm.toLowerCase()) ||
    site.verantwoordelijke.toLowerCase().includes(zoekterm.toLowerCase()),
  );

  const gesorteerdeSites = sorteerSites(filteredSites);
  
  // Gebruik ofwel de loading/error van de parent of van dit component
  const isLoading = parentLoading || loading;
  const hasError = parentError || error;

  return (
    <div className="flex-col md:flex-row flex justify-between py-6">
      <div className="w-full">
        
        <div className="mb-4 flex flex-wrap items-center justify-between">
          {/* Search input */}
          <Search 
            value={zoekterm} 
            onChange={handleSearch} 
            placeholder="Zoeken naar site, verantwoordelijke, ..."
          />
          
          {/* Page size selector - niet zichtbaar op small screens */}
          <div className="hidden md:flex items-center mt-3 md:mt-0">
            <label htmlFor="page-size" className="mr-2 text-gray-700">
              Aantal sites per pagina:
            </label>
            <select
              id="page-size"
              value={limit}
              onChange={handleLimitChange}
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

        <AsyncData error={hasError} loading={isLoading}>
          <SiteTable
            sites={gesorteerdeSites}
            sorteerVolgorde={sorteerVolgorde}
            onSort={handleSort}
            onShow={handleShow}
            onShowGrondplan={handleShowGrondplan}
          />
          
          <div className="mt-6">
            <Pagination 
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              data={pagination}
              loading={loading}
              error={error}
            />
          </div>
        </AsyncData>
      </div>
    </div>
  );
}