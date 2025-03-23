import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteTable from './SiteTable';
import { Pagination } from '../../genericComponents/Pagination';
import useSiteData from '../../../hooks/useSiteData';
import SiteListHeader from './SiteListHeader';
import SiteListFilters from './SiteListFilters';

export default function SiteList({data}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [zoekterm, setZoekterm] = useState('');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [verantwoordelijkeFilter, setVerantwoordelijkeFilter] = useState('');
  const [aantalMachinesMin, setAantalMachinesMin] = useState('');
  const [aantalMachinesMax, setAantalMachinesMax] = useState('');
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    field: 'id',
    direction: 'asc',
  });
  console.log(data);
  
  // Process data with custom hook
  const { 
    filteredSites,
    paginatedSites,
    uniqueStatuses,
    uniqueVerantwoordelijken,
  } = useSiteData({
    rawData: data?.items || [],
    zoekterm,
    statusFilter,
    verantwoordelijkeFilter,
    aantalMachinesMin,
    aantalMachinesMax,
    sortConfig,
    currentPage,
    limit,
  });
  
  // Event handlers
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
  
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1); 
  };

  const handleResetFilters = () => {
    setStatusFilter('');
    setVerantwoordelijkeFilter('');
    setAantalMachinesMin('');
    setAantalMachinesMax('');
    setZoekterm('');
    setCurrentPage(1);
  };

  // Navigation handlers
  const handleShow = (id) => {
    navigate(`/sites/${id}`);
  };
  
  const handleShowGrondplan = (id) => {
    navigate(`/sites/${id}/grondplan`);
  };

  const handleEditSite = (id) => {
    navigate(`/sites/${id}/edit`);
  };

  // Filter change handlers
  const handleFilterChange = {
    status: (e) => {
      setStatusFilter(e.target.value);
      setCurrentPage(1);
    },
    verantwoordelijke: (e) => {
      setVerantwoordelijkeFilter(e.target.value);
      setCurrentPage(1);
    },
    aantalMachinesMin: (e) => {
      const value = e.target.value;
      if (value === '' || /^\d+$/.test(value)) {
        setAantalMachinesMin(value);
        setCurrentPage(1);
      }
    },
    aantalMachinesMax: (e) => {
      const value = e.target.value;
      if (value === '' || /^\d+$/.test(value)) {
        setAantalMachinesMax(value);
        setCurrentPage(1);
      }
    },
  };
  
  return (
    <div className="flex-col md:flex-row flex justify-between py-6">
      <div className="w-full">
        <SiteListHeader 
          zoekterm={zoekterm}
          onSearch={handleSearch}
          limit={limit}
          onLimitChange={handleLimitChange}
        />

        <SiteListFilters 
          statusFilter={statusFilter}
          verantwoordelijkeFilter={verantwoordelijkeFilter}
          aantalMachinesMin={aantalMachinesMin}
          aantalMachinesMax={aantalMachinesMax}
          uniqueStatuses={uniqueStatuses}
          uniqueVerantwoordelijken={uniqueVerantwoordelijken}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

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
      </div>
    </div>
  );
}