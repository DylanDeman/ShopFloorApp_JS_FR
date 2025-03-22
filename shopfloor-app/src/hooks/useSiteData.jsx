// hooks/useSiteData.js
import { useState, useEffect } from 'react';

export default function useSiteData({
  rawData,
  zoekterm,
  statusFilter,
  verantwoordelijkeFilter,
  aantalMachinesMin,
  aantalMachinesMax,
  sortConfig,
  currentPage,
  limit,
}) {
  const [processedSites, setProcessedSites] = useState([]);
  const [uniqueStatuses, setUniqueStatuses] = useState([]);
  const [uniqueVerantwoordelijken, setUniqueVerantwoordelijken] = useState([]);
  const [maxMachineCount, setMaxMachineCount] = useState(0);

  // Process raw data into a more usable format
  useEffect(() => {
    if (rawData && rawData.length > 0) {
      const processed = rawData.map((site) => ({
        id: site.id,
        naam: site.naam,
        status: site.status,
        verantwoordelijke: `${site.verantwoordelijke?.voornaam} ${site.verantwoordelijke?.naam}`,
        aantal_machines: site.machines ? site.machines?.length : 0,
      }));
      
      setProcessedSites(processed);
      
      // Extract unique values for filters
      const statuses = [...new Set(processed.map((site) => site.status))].filter(Boolean);
      setUniqueStatuses(statuses);
      
      const verantwoordelijken = [...new Set(processed.map((site) => site.verantwoordelijke))].filter(Boolean);
      setUniqueVerantwoordelijken(verantwoordelijken);
      
      const maxMachines = Math.max(...processed.map((site) => site.aantal_machines));
      setMaxMachineCount(maxMachines);
    }
  }, [rawData]);

  // Filter sites based on search term and filters
  const filteredSites = processedSites.filter((site) => {
    // Text search filter
    const matchesSearch =
      !zoekterm || 
      site.naam?.toLowerCase().includes(zoekterm.toLowerCase()) ||
      site.verantwoordelijke?.toLowerCase().includes(zoekterm.toLowerCase());
    
    // Status filter
    const matchesStatus = !statusFilter || site.status === statusFilter;
    
    // Verantwoordelijke filter
    const matchesVerantwoordelijke = !verantwoordelijkeFilter || 
      site.verantwoordelijke === verantwoordelijkeFilter;
    
    // Aantal machines filter - min value
    const minMachines = aantalMachinesMin === '' ? null : parseInt(aantalMachinesMin, 10);
    const matchesMinMachines = minMachines === null || site.aantal_machines >= minMachines;
    
    // Aantal machines filter - max value
    const maxMachines = aantalMachinesMax === '' ? null : parseInt(aantalMachinesMax, 10);
    const matchesMaxMachines = maxMachines === null || site.aantal_machines <= maxMachines;
    
    return matchesSearch && matchesStatus && matchesVerantwoordelijke && 
           matchesMinMachines && matchesMaxMachines;
  });

  // Sort sites
  const sortedAndFilteredSites = sortSites(filteredSites, sortConfig);
  
  // Paginate sites
  const paginatedSites = paginateSites(sortedAndFilteredSites, currentPage, limit);
  
  return {
    processedSites,
    filteredSites,
    sortedAndFilteredSites,
    paginatedSites,
    uniqueStatuses,
    uniqueVerantwoordelijken,
    maxMachineCount,
  };
}

// Utility functions
function sortSites(sites, sortConfig) {
  if (!sortConfig.field || !sites) return sites;
  
  const sortedSites = [...sites]; 
  const integerFields = ['id', 'aantal_machines'];
  const sortFn = integerFields.includes(sortConfig.field) ? sortInteger : sortString;
  
  return sortedSites.sort((a, b) => 
    sortFn(a, b, sortConfig.field, sortConfig.direction),
  );
}

function paginateSites(sites, currentPage, limit) {
  if(!sites) return sites;
  return sites.slice((currentPage - 1) * limit, limit * currentPage);
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