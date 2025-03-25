import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '../../genericComponents/Pagination';
import useSiteData from '../../../hooks/useSiteData';
import SiteListFilters from './SiteListFilters';
import GenericTable from '../../genericComponents/GenericTable';
import GenericListHeader from '../../genericComponents/GenericListHeader';
import { useAuth } from '../../../contexts/auth';

export default function SiteList({data}) {
  const navigate = useNavigate();
  const { role } = useAuth();
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
    setZoekterm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing limit
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
        <GenericListHeader
          zoekterm={zoekterm}
          onSearch={handleSearch}
          limit={limit}
          onLimitChange={handleLimitChange}
          searchPlaceholder="Zoek naar site, verantwoordelijke, ..."
          listPageSizeSelectorPlaceholder="Aantal sites per pagina"
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

        <GenericTable
          data={paginatedSites}
          columns={{
            'Nr.': 'id',
            'Naam': 'naam',
            'Verantwoordelijke': 'verantwoordelijke',
            'Status': 'status',
            'Aantal machines': 'aantal_machines',
          }}
          onSort={handleSort}
          onShow={handleShow}
          onEdit={role === 'MANAGER' ? handleEditSite : undefined}
          sortConfig={sortConfig}
          emptyMessage="Er zijn geen sites beschikbaar."
          dataCyPrefix="site"
        />

        <Pagination 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          data={data}
          totalPages={filteredSites.length === 0 ? 1 : Math.ceil(filteredSites.length / limit)}
        />
      </div>
    </div>
  );
}