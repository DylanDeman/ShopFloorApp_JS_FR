import { useState, useEffect, useMemo } from 'react';
import { convertProductieStatus } from '../components/machines/ProductieConverter';
import { convertStatus } from '../components/machines/StatusConverter';
import { StatusDisplay } from '../components/machines/StatusDisplay';
import { ProductieStatusDisplay } from '../components/machines/ProductieStatusDisplay';

export default function useMachineData({
  rawData,
  zoekterm,
  locatieFilter,
  statusFilter,
  productieStatusFilter,
  techniekerFilter,
  sortConfig,
  currentPage,
  limit,
}) {
  const [processedMachines, setProcessedMachines] = useState([]);
  const [uniqueLocaties, setUniqueLocaties] = useState([]);
  const [uniqueStatuses, setUniqueStatuses] = useState([]);
  const [uniqueProductieStatuses, setUniqueProductieStatuses] = useState([]);
  const [uniqueTechniekers, setUniqueTechniekers] = useState([]);

  // Process raw data into a more usable format
  useEffect(() => {
    if (rawData && rawData.length > 0) {
      const processed = rawData.map((machine) => ({
        id: machine.id,
        locatie: machine.locatie,
        rawStatus: machine.status,
        rawProductieStatus: machine.productie_status,
        technieker: `${machine.technieker.naam} ${machine.technieker.voornaam}`,
      }));
      
      setProcessedMachines(processed);
      
      // Extract unique values for filters
      const locaties = [...new Set(processed.map((machine) => machine.locatie))].filter(Boolean).sort();
      setUniqueLocaties(locaties);
      
      const statuses = [...new Set(processed.map((machine) => {
        const status = convertStatus(machine.rawStatus);
        return status?.text || '';
      }))].filter(Boolean).sort();
      setUniqueStatuses(statuses);
      
      const productieStatuses = [...new Set(processed.map((machine) => {
        const status = convertProductieStatus(machine.rawProductieStatus);
        return status?.text || '';
      }))].filter(Boolean).sort();
      setUniqueProductieStatuses(productieStatuses);
      
      const techniekers = [...new Set(processed.map((machine) => machine.technieker))].filter(Boolean).sort();
      setUniqueTechniekers(techniekers);
    }
  }, [rawData]);

  // Filter machines based on search term and filters
  const filteredMachines = useMemo(() => {
    return processedMachines.filter((machine) => {
      const statusText = convertStatus(machine.rawStatus)?.text || '';
      const productieStatusText = convertProductieStatus(machine.rawProductieStatus)?.text || '';
      
      // Text search filter
      const matchesSearch = !zoekterm || 
        machine.locatie?.toLowerCase().includes(zoekterm.toLowerCase()) ||
        statusText.toLowerCase().includes(zoekterm.toLowerCase()) ||
        productieStatusText.toLowerCase().includes(zoekterm.toLowerCase()) ||
        machine.technieker.toLowerCase().includes(zoekterm.toLowerCase());
      
      // Dropdown filters
      const matchesLocatie = !locatieFilter || machine.locatie === locatieFilter;
      const matchesStatus = !statusFilter || statusText === statusFilter;
      const matchesProductieStatus = !productieStatusFilter || productieStatusText === productieStatusFilter;
      const matchesTechnieker = !techniekerFilter || machine.technieker === techniekerFilter;
      
      return matchesSearch && matchesLocatie && matchesStatus && matchesProductieStatus && matchesTechnieker;
    });
  }, [
    processedMachines,
    zoekterm,
    locatieFilter,
    statusFilter,
    productieStatusFilter,
    techniekerFilter,
  ]);

  // Sort machines
  const sortedMachines = useMemo(() => {
    return sortMachines(filteredMachines, sortConfig);
  }, [filteredMachines, sortConfig]);
  
  // Paginate machines
  const paginatedMachines = useMemo(() => {
    return paginateMachines(sortedMachines, currentPage, limit);
  }, [sortedMachines, currentPage, limit]);
  
  // Format machines for display
  const formattedPaginatedMachines = useMemo(() => {
    return paginatedMachines.map((machine) => ({
      id: machine.id,
      locatie: machine.locatie,
      status: <StatusDisplay status={machine.rawStatus} />,
      productie_status: <ProductieStatusDisplay status={machine.rawProductieStatus} />,
      technieker: machine.technieker,
    }));
  }, [paginatedMachines]);
  
  return {
    processedMachines,
    filteredMachines,
    sortedMachines,
    paginatedMachines: formattedPaginatedMachines,
    uniqueLocaties,
    uniqueStatuses,
    uniqueProductieStatuses,
    uniqueTechniekers,
  };
}

// Utility functions
function sortMachines(machines, sortConfig) {
  if (!sortConfig.field || !machines) return machines;
  
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
}

function paginateMachines(machines, currentPage, limit) {
  if(!machines) return machines;
  const startIndex = (currentPage - 1) * limit;
  return machines.slice(startIndex, startIndex + limit);
}

function sortInteger(a, b, field, direction) {
  return direction === 'asc' 
    ? a[field] - b[field] 
    : b[field] - a[field];
}

function sortString(a, b, field, direction) {
  const valueA = String(a[field]).toLowerCase();
  const valueB = String(b[field]).toLowerCase();
  
  if (valueA < valueB) {
    return direction === 'asc' ? -1 : 1;
  }
  if (valueA > valueB) {
    return direction === 'asc' ? 1 : -1;
  }
  return 0;
}