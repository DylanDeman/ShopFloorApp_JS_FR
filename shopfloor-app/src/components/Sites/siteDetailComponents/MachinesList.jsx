import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MachineTable from '../../machines/machineOverzichtComponents/MachineTable';
import { Pagination } from '../../genericComponents/Pagination';
import { convertProductieStatus } from '../../machines/ProductieConverter';
import { ProductieStatusDisplay } from '../../machines/ProductieStatusDisplay';
import { StatusDisplay } from '../../machines/StatusDisplay';
import { convertStatus } from '../../machines/StatusConverter';
import MachineListHeader from '../../machines/machineOverzichtComponents/MachineListHeader';
import MachineListFilters from './MachineListFilters';

export default function MachineList({machinesData}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [zoekterm, setZoekterm] = useState('');
  const rawDataMachines = machinesData || {};
  
  // Filter states
  const [locatieFilter, setLocatieFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [productieStatusFilter, setProductieStatusFilter] = useState('');
  const [techniekerFilter, setTechniekerFilter] = useState('');

  const rawMachines = rawDataMachines.map((site) => ({
    id: site.id,
    locatie: site.locatie,
    rawStatus: site.status,
    rawProductieStatus: site.productie_status,
    technieker: `${site.technieker.naam} ${site.technieker.voornaam}`,
  }));

  // Get unique values for filters
  const uniqueLocaties = useMemo(() => {
    const locaties = [...new Set(rawMachines.map((machine) => machine.locatie))];
    return locaties.sort();
  }, [rawMachines]);

  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(rawMachines.map((machine) => {
      const status = convertStatus(machine.rawStatus);
      return status?.text || '';
    }))];
    return statuses.filter((status) => status !== '').sort();
  }, [rawMachines]);

  const uniqueProductieStatuses = useMemo(() => {
    const statuses = [...new Set(rawMachines.map((machine) => {
      const status = convertProductieStatus(machine.rawProductieStatus);
      return status?.text || '';
    }))];
    return statuses.filter((status) => status !== '').sort();
  }, [rawMachines]);

  const uniqueTechniekers = useMemo(() => {
    const techniekers = [...new Set(rawMachines.map((machine) => machine.technieker))];
    return techniekers.sort();
  }, [rawMachines]);

  // Sorting state
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

  const sortMachines = (machines) => {
    if (!sortConfig.field) return machines;
    
    const sortedMachines = [...machines]; 
    
    // Map special fields to their sortable values
    const fieldMap = {
      'status': 'rawStatus',
      'productie_status': 'rawProductieStatus',
    };
    
    const sortField = fieldMap[sortConfig.field] || sortConfig.field;
    const integerFields = ['id'];
    const sortFn = integerFields.includes(sortField) ? sortInteger : sortString;
    
    return sortedMachines.sort((a, b) => 
      sortFn(a, b, sortField, sortConfig.direction),
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

  const handleEditMachine = (id) => {
    navigate(`/machines/${id}/edit`);
  };  
  
  const handleSearch = (e) => {
    setZoekterm(e.target.value);
    setCurrentPage(1);
  };

  const handleShow = (id) => {
    navigate(`/machines/${id}`);
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

  const filteredMachines = rawMachines.filter((machine) => {
    const statusText = convertStatus(machine.rawStatus)?.text || '';
    const productieStatusText = convertProductieStatus(machine.rawProductieStatus)?.text || '';
    
    // Text search filter
    const matchesSearch = zoekterm === '' || 
      machine.locatie?.toLowerCase().includes(zoekterm.toLowerCase()) ||
      statusText.toLowerCase().includes(zoekterm.toLowerCase()) ||
      productieStatusText.toLowerCase().includes(zoekterm.toLowerCase()) ||
      machine.technieker.toLowerCase().includes(zoekterm.toLowerCase());
    
    // Dropdown filters
    const matchesLocatie = locatieFilter === '' || machine.locatie === locatieFilter;
    const matchesStatus = statusFilter === '' || statusText === statusFilter;
    const matchesProductieStatus = productieStatusFilter === '' || productieStatusText === productieStatusFilter;
    const matchesTechnieker = techniekerFilter === '' || machine.technieker === techniekerFilter;
    
    return matchesSearch && matchesLocatie && matchesStatus && matchesProductieStatus && matchesTechnieker;
  });

  const sortedMachines = sortMachines(filteredMachines);
  
  const startIndex = (currentPage - 1) * limit;
  const paginatedMachines = sortedMachines.slice(startIndex, startIndex + limit);
  
  const processedPaginatedMachines = paginatedMachines.map((machine) => ({
    id: machine.id,
    locatie: machine.locatie,
    status: <StatusDisplay status={machine.rawStatus} />,
    productie_status: <ProductieStatusDisplay status={machine.rawProductieStatus} />,
    technieker: machine.technieker,
  }));

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
          machines={processedPaginatedMachines}
          onShow={handleShow}
          onSort={handleSort}
          onEdit={handleEditMachine}
          sortConfig={sortConfig}
        />
        
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            data={rawMachines}
            totalPages={sortedMachines.length === 0 ? 1 : Math.ceil(sortedMachines.length / limit)}
          />
        </div>
      </div>
    </div>
  );
}