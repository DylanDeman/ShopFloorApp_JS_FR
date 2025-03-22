import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MachineTable from '../../machines/machineOverzichtComponents/MachineTable';
import { Pagination } from '../../genericComponents/Pagination';
import { convertProductieStatus } from '../../machines/ProductieConverter';
import { ProductieStatusDisplay } from '../../machines/ProductieStatusDisplay';
import { StatusDisplay } from '../../machines/StatusDisplay';
import { convertStatus } from '../../machines/StatusConverter';
import MachineListHeader from '../../machines/machineOverzichtComponents/MachineListHeader';

export default function MachineList({machinesData}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [zoekterm, setZoekterm] = useState('');
  const rawDataMachines = machinesData || {};
  
  const rawMachines = rawDataMachines.map((site) => ({
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

  const handleEditMachine = (id) => {
    navigate(`/machines/${id}/edit`);
  };  
  const handleSearch = (e) => {
    setZoekterm(e.target.value);
  };

  const handleShow = (id) => {
    navigate(`/machines/${id}`);
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
        <MachineListHeader
          zoekterm={zoekterm}
          onSearch={handleSearch}
          limit={limit}
          onLimitChange={handleLimitChange}
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
