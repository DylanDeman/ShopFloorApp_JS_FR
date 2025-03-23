import { useMemo } from 'react';
import { StatusDisplay } from '../components/genericComponents/StatusDisplay';
import { convertStatus } from '../components/genericComponents/StatusConverter';

export default function useOnderhoudData({
  onderhouden,
  zoekterm,
  statusFilter,
  technikerFilter,
  redenFilter,
  sortConfig,
  currentPage,
  limit,
}) {
  // Process data using useMemo (NO useState)
  const processedOnderhouden = useMemo(() => {
    if (!onderhouden || onderhouden.length === 0) return [];
    
    return onderhouden.map((onderhoud) => ({
      id: onderhoud.id,
      technieker: onderhoud.technieker,
      datum: onderhoud.datum,
      starttijdstip: onderhoud.starttijdstip,
      eindtijdstip: onderhoud.eindtijdstip,
      reden: onderhoud.reden,
      rawStatus: onderhoud.status,
      opmerkingen: onderhoud.opmerkingen,
    }));
  }, [onderhouden]);

  // Extract unique values for dropdowns
  const uniqueStatuses = useMemo(() => {
    return [...new Set(processedOnderhouden.map((onderhoud) => {
      const status = convertStatus(onderhoud.rawStatus);
      return status?.text || '';
    }))].filter(Boolean).sort();
  }, [processedOnderhouden]);

  const uniqueTechniekers = useMemo(() => {
    return [...new Set(processedOnderhouden.map((onderhoud) => onderhoud.technieker))].filter(Boolean).sort();
  }, [processedOnderhouden]);

  const uniqueRedenen = useMemo(() => {
    return [...new Set(processedOnderhouden.map((onderhoud) => onderhoud.reden))].filter(Boolean).sort();
  }, [processedOnderhouden]);

  // Apply filters
  const filteredOnderhouden = useMemo(() => {
    return processedOnderhouden.filter((onderhoud) => {
      const statusText = convertStatus(onderhoud.rawStatus)?.text || '';

      const matchesSearch = !zoekterm ||
        onderhoud.technieker?.toLowerCase().includes(zoekterm.toLowerCase()) ||
        onderhoud.datum?.toLowerCase().includes(zoekterm.toLowerCase()) ||
        onderhoud.reden?.toLowerCase().includes(zoekterm.toLowerCase()) ||
        statusText.toLowerCase().includes(zoekterm.toLowerCase()) ||
        onderhoud.opmerkingen?.toLowerCase().includes(zoekterm.toLowerCase());

      const matchesStatus = !statusFilter || statusText === statusFilter;
      const matchesTechnieker = !technikerFilter || onderhoud.technieker === technikerFilter;
      const matchesReden = !redenFilter || onderhoud.reden === redenFilter;

      return matchesSearch && matchesStatus && matchesTechnieker && matchesReden;
    });
  }, [processedOnderhouden, zoekterm, statusFilter, technikerFilter, redenFilter]);

  // Sorting
  const sortedOnderhouden = useMemo(() => {
    return sortOnderhouden(filteredOnderhouden, sortConfig);
  }, [filteredOnderhouden, sortConfig]);

  // Pagination
  const paginatedOnderhouden = useMemo(() => {
    return paginateOnderhouden(sortedOnderhouden, currentPage, limit);
  }, [sortedOnderhouden, currentPage, limit]);

  // Format final data with UI components
  const formattedPaginatedOnderhouden = useMemo(() => {
    return paginatedOnderhouden.map((onderhoud) => ({
      ...onderhoud,
      status: <StatusDisplay status={onderhoud.rawStatus} />,
      onderhoudsrapport: 
        <span className='bg-red-500 p-2 rounded text-white 
        hover:bg-red-700 hover:cursor-pointer'>Genereer rapport</span>,
    }));
  }, [paginatedOnderhouden]);

  return {
    processedOnderhouden,
    filteredOnderhouden,
    sortedOnderhouden,
    paginatedOnderhouden: formattedPaginatedOnderhouden,
    uniqueStatuses,
    uniqueTechniekers,
    uniqueRedenen,
  };
}

function sortOnderhouden(onderhouden, sortConfig) {
  if (!sortConfig?.field || !onderhouden) return onderhouden;

  const sortedOnderhouden = [...onderhouden];

  // Map special fields to their sortable values
  const fieldMap = {
    status: 'rawStatus',
  };

  const sortField = fieldMap[sortConfig.field] || sortConfig.field;
  const integerFields = ['id'];
  const sortFn = integerFields.includes(sortConfig.field) ? sortInteger : sortString;

  return sortedOnderhouden.sort((a, b) => sortFn(a, b, sortField, sortConfig.direction));
}

function paginateOnderhouden(onderhouden, currentPage, limit) {
  if (!onderhouden) return onderhouden;
  return onderhouden.slice((currentPage - 1) * limit, limit * currentPage);
}

function sortInteger(a, b, field, direction) {
  return direction === 'asc' ? a[field] - b[field] : b[field] - a[field];
}

function sortString(a, b, field, direction) {
  const valueA = String(a[field] || '').toLowerCase();
  const valueB = String(b[field] || '').toLowerCase();

  if (valueA < valueB) return direction === 'asc' ? -1 : 1;
  if (valueA > valueB) return direction === 'asc' ? 1 : -1;
  return 0;
}
