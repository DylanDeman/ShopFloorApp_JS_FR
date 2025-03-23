import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MachineTable from '../../machines/machineDetailsComponents/MachineTable';
import { Pagination } from '../../genericComponents/Pagination';
import MachineListHeader from '../../machines/machineOverzichtComponents/MachineListHeader';
import MachineListFilters from './MachineListFilters';
import useMachineData from '../../../hooks/useSiteMachineData';

export default function MachineList({machinesData}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [zoekterm, setZoekterm] = useState('');
  
  // Filter states
  const [locatieFilter, setLocatieFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [productieStatusFilter, setProductieStatusFilter] = useState('');
  const [techniekerFilter, setTechniekerFilter] = useState('');

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    field: 'id',
    direction: 'asc',
  });
  console.log('machinesData:', machinesData);
  
  // Process data with custom hook
  const { 
    filteredMachines,
    paginatedMachines,
    uniqueLocaties,
    uniqueStatuses,
    uniqueProductieStatuses,
    uniqueTechniekers,
  } = useMachineData({
    rawData: machinesData || [],
    zoekterm,
    locatieFilter,
    statusFilter,
    productieStatusFilter, 
    techniekerFilter,
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
    setCurrentPage(1);
  };
  
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1); 
  };

  const handleResetFilters = () => {
    setLocatieFilter('');
    setStatusFilter('');
    setProductieStatusFilter('');
    setTechniekerFilter('');
    setZoekterm('');
    setCurrentPage(1);
  };

  // Navigation handlers
  const handleShow = (id) => {
    navigate(`/machines/${id}`);
  };

  const handleEditMachine = (id) => {
    navigate(`/machines/${id}/edit`);
  };

  // Filter change handlers
  const handleFilterChange = {
    locatie: (e) => {
      setLocatieFilter(e.target.value);
      setCurrentPage(1);
    },
    status: (e) => {
      setStatusFilter(e.target.value);
      setCurrentPage(1);
    },
    productieStatus: (e) => {
      setProductieStatusFilter(e.target.value);
      setCurrentPage(1);
    },
    technieker: (e) => {
      setTechniekerFilter(e.target.value);
      setCurrentPage(1);
    },
  };

  return (
    <div className="flex-col md:flex-row flex justify-between py-6">
      <div className="w-full">
        <MachineListHeader
          zoekterm={zoekterm}
          onSearch={handleSearch}
          limit={limit}
          onLimitChange={handleLimitChange}
        />

        <MachineListFilters 
          locatieFilter={locatieFilter}
          statusFilter={statusFilter}
          productieStatusFilter={productieStatusFilter}
          techniekerFilter={techniekerFilter}
          uniqueLocaties={uniqueLocaties}
          uniqueStatuses={uniqueStatuses}
          uniqueProductieStatuses={uniqueProductieStatuses}
          uniqueTechniekers={uniqueTechniekers}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        <MachineTable
          machines={paginatedMachines}
          onShow={handleShow}
          onSort={handleSort}
          onEdit={handleEditMachine}
          sortConfig={sortConfig}
        />
        
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            data={machinesData}
            totalPages={filteredMachines.length === 0 ? 1 : Math.ceil(filteredMachines.length / limit)}
          />
        </div>
      </div>
    </div>
  );
}