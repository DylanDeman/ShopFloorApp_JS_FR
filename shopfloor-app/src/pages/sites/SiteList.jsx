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
  
  // state bijhouden van sortering voor deze twee kolommen
  const [sorteerVolgorde, setSorteerVolgorde] = useState(null);
  const [sorteerVolgordeId, setSorteerVolgordeId] = useState(null);
  
  const [zoekterm, setZoekterm] = useState('');

  const { data, loading, error } = useSWR(
    'sites', 
    getAll,
  );

  const sites = data?.items || [];

  // Sorteer functie (voor id en aantalMachines!)
  const sorteerSites = (sites) => {
    let sortedSites = [...sites]; // deep copy maken van sites
    
    if (sorteerVolgorde) {
      sortedSites = sortedSites.sort((a, b) =>
        sorteerVolgorde === 'asc' 
          ? a.aantalMachines - b.aantalMachines 
          : b.aantalMachines - a.aantalMachines,
      );
    }
    
    if (sorteerVolgordeId) {
      sortedSites = sortedSites.sort((a, b) =>
        sorteerVolgordeId === 'asc' 
          ? a.id - b.id 
          : b.id - a.id,
      );
    }
    return sortedSites;
  };

  const paginateSites = (sorteerdeSites) => {
    if(!sorteerdeSites){
      return sorteerdeSites;
    }
    return sorteerdeSites.slice((currentPage -1) * limit, limit * currentPage);
  };

  const handleSortMachines = () => {
    setSorteerVolgordeId(null);
    setSorteerVolgorde((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };
  
  const handleSortId = () => {
    setSorteerVolgorde(null);
    setSorteerVolgordeId((prev) => (prev === 'asc' ? 'desc' : 'asc'));
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

  const handleEditSite = (id) => {
    window.alert('Site bewerken met id ' + id);
    // TODO: navigeren naar edit scherm!!!
    //navigate(`/sites/${id}/edit`);
  };

  const filteredSites = sites.filter((site) =>
    site.naam.toLowerCase().includes(zoekterm.toLowerCase()) ||
    site.verantwoordelijke.toLowerCase().includes(zoekterm.toLowerCase()),
  );

  const sorteerdeSites = sorteerSites(filteredSites);

  const paginatedSites = paginateSites(sorteerdeSites);
  
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
            sites={paginatedSites}
            sorteerVolgorde={sorteerVolgorde}
            sorteerVolgordeId={sorteerVolgordeId}
            onSortMachines={handleSortMachines}
            onSortId={handleSortId}
            onShow={handleShow}
            onShowGrondplan={handleShowGrondplan}
            onEdit={handleEditSite}
          />
          
          <div className="mt-6">
            <Pagination 
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              data={data}
              limit={limit}
              loading={loading}
              error={error}
            />
          </div>
        </AsyncData>
      </div>
    </div>
  );
}