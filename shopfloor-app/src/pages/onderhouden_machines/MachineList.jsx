import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MachineTable from '../../components/onderhouden_machines/MachineTable';
import { Pagination } from '../../components/genericComponents/Pagination';
import Search from '../../components/genericComponents/Search';
import { convertStatus } from '../../components/machines/StatusConverter';
import { convertProductieStatus } from '../../components/machines/ProductieConverter';
import { ProductieStatusDisplay } from '../../components/machines/ProductieStatusConverter';
import { StatusDisplay } from '../../components/machines/StatusDisplay';

export default function MachineList({machinesData}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [zoekterm, setZoekterm] = useState('');
  const rawDataMachines = machinesData || { items: [] };
  
  const rawMachines = rawDataMachines.items.map((site) => ({
    id: site.id,
    locatie: site.locatie,
    rawStatus: site.status,
    rawProductieStatus: site.productie_status,
    technieker: `${site.technieker.naam} ${site.technieker.voornaam}`,
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
  
  const handleShowOnderhouden = (id) => {
    navigate(`./${id}`);
  };

  const handleShow = (id) => {
    navigate(`./${id}`);
  };

  const handleSearch = (e) => {
    setZoekterm(e.target.value);
  };
  
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1); 
  };

  const filteredMachines = rawMachines.filter((machine) => {
    const statusText = convertStatus(machine.rawStatus)?.text?.toLowerCase() || '';
    const productieStatusText = convertProductieStatus(machine.rawProductieStatus)?.text?.toLowerCase() || '';
    
    return machine.locatie?.toLowerCase().includes(zoekterm.toLowerCase()) ||
           statusText.includes(zoekterm.toLowerCase()) ||
           productieStatusText.includes(zoekterm.toLowerCase());
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
        <div className="mb-4 flex flex-wrap items-center justify-between">

          {/* Search input */}
          <Search 
            value={zoekterm} 
            onChange={handleSearch} 
            placeholder="Zoeken naar locatie, status, productie status, ..."
          />
          
          {/* Page size selector - niet zichtbaar op small screens */}
          <div className="hidden md:flex items-center mt-3 md:mt-0">
            <label htmlFor="page-size" className="mr-2 text-gray-700">
              Aantal machines per pagina:
            </label>
            <select
              id="page-size"
              value={limit}
              onChange={handleLimitChange}
              className="border border-gray-300 rounded-md px-3 py-2"
              data-cy="machines_page_size"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <MachineTable
          machines={processedPaginatedMachines}
          showOnderhouden={handleShowOnderhouden}
          onShow={handleShow}
          onSort={handleSort}
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