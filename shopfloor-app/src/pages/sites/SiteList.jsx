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
  const [zoekterm, setZoekterm] = useState('');
  
  const { data, loading, error } = useSWR(
    'sites', 
    getAll,
  );
  const rawDataSites = data?.items || [];

  const processedSites = rawDataSites.map((site) => ({
    id: site.id,
    naam: site.naam,
    verantwoordelijke: `${site.verantwoordelijke?.voornaam} ${site.verantwoordelijke?.naam}`,
    aantal_machines: site.machines ? site.machines?.length : 0,
  }));

  const [sortConfig, setSortConfig] = useState({
    field: 'id',
    direction: 'asc',
  });

  const sortInteger = (a, b, field, direction) => {
    return direction === 'asc' 
      ? a[field] - b[field] 
      : b[field] - a[field];
  };
  
  const sortString = (a, b, field, direction) => {
    const valueA = String(a[field]).toLowerCase();
    const valueB = String(b[field]).toLowerCase();
    
    if (valueA < valueB) {
      return direction === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  };

  const sortSites = (machines) => {
    if (!sortConfig.field) return machines;
    
    const sortedMachines = [...machines]; 
    console.log(sortConfig.field);
    const integerFields = ['id', 'aantal_machines'];
    const sortFn = integerFields.includes(sortConfig.field) ? sortInteger : sortString;
    
    return sortedMachines.sort((a, b) => 
      sortFn(a, b, sortConfig.field, sortConfig.direction),
    );
  };

  const handleSort = (field) => {
    setSortConfig((prevConfig) => ({
      field,
      direction: 
        prevConfig.field === field
          ? prevConfig.direction === 'asc' ? 'desc' : 'asc'
          : 'asc',
    }));
  };
  
  const handleSearch = (e) => {
    setCurrentPage(1);
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

  const paginateSites = (sorteerdeSites) => {
    if(!sorteerdeSites){
      return sorteerdeSites;
    }
    return sorteerdeSites.slice((currentPage -1) * limit, limit * currentPage);
  };

  const handleEditSite = (id) => {
    window.alert('Site bewerken met id ' + id);
    // TODO: navigeren naar edit scherm!!!
    //navigate(`/sites/${id}/edit`);
  };

  const filteredSites = processedSites.filter((site) =>
    site.naam?.toLowerCase().includes(zoekterm.toLowerCase()) ||
    (`${site.verantwoordelijke?.voornaam} ${site.verantwoordelijke?.naam}`)
      .toLowerCase().includes(zoekterm.toLowerCase()),
  );

  const sortedMachines = sortSites(filteredSites);
  const paginatedSites = paginateSites(sortedMachines);
  
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
            onShow={handleShow}
            onSort={handleSort}
            sortConfig={sortConfig}
            onShowGrondplan={handleShowGrondplan}
            onEdit={handleEditSite}
          />
          
          <div className="mt-6">
            <Pagination 
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              data={data}
              totalPages={filteredSites.length === 0 ? 1 : Math.ceil(filteredSites.length / limit)}
            />
          </div>
        </AsyncData>
      </div>
    </div>
  );
}