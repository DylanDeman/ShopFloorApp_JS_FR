import { useState } from 'react';
import { Pagination } from '../../genericComponents/Pagination';
import Search from '../../genericComponents/Search';
import OnderhoudenFilter from './OnderhoudListFilters';
import useOnderhoudData from '../../../hooks/useOnderhoudData';
import GenericTable from '../../genericComponents/GenericTable';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import PdfDocument from '../PdfDocument';

export default function OnderhoudList({machine}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [zoekterm, setZoekterm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [technikerFilter, setTechnikerFilter] = useState('');
  const [redenFilter, setRedenFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [sortConfig, setSortConfig] = useState({
    field: 'id',
    direction: 'asc',
  });

  const processedOnderhouden = machine.onderhouden?.map((onderhoud) => ({
    id: onderhoud.id,
    technieker: `${onderhoud.technieker.naam} ${onderhoud.technieker.voornaam}`,
    datum: onderhoud.datum,
    starttijdstip: onderhoud.starttijdstip,
    eindtijdstip: onderhoud.eindtijdstip,
    reden: onderhoud.reden,
    status: onderhoud.status,
    opmerkingen: onderhoud.opmerkingen,
  }));

  // Use the custom hook for filtering and sorting
  const {
    paginatedOnderhouden,
    uniqueStatuses,
    uniqueTechniekers,
    uniqueRedenen,
    filteredOnderhouden,
  } = useOnderhoudData({
    onderhouden: processedOnderhouden,
    zoekterm,
    statusFilter,
    technikerFilter,
    redenFilter,
    sortConfig,
    currentPage,
    limit,
  });

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

  const fetchBase64Logo = async () => {
    try {
      const response = await fetch('/base64DelawareLogo.txt'); // Ensure the file is in the public directory
      const logoData = await response.text();
      return logoData; // Return the base64 string
    } catch (error) {
      console.error('Error loading base64 logo:', error);
      return ''; // Return an empty string or handle it as needed
    }
  };
  
  const handleRapport = async (machine, rowData) =>{
    rowData.machine = machine;
    const base64Logo = await fetchBase64Logo();
    const date = new Date(rowData.datum).toLocaleDateString();
    const blob = await pdf(<PdfDocument data={rowData} base64Logo={base64Logo} />).toBlob();
    saveAs(blob, `${rowData.id}-onderhoud-${date}_machine-${machine.code}.pdf`);
  };

  const handleGenerateRapport = async (rowData) => {
    console.log('Generating rapport for onderhoud:', rowData);
    handleRapport(machine, rowData);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const resetFilters = () => {
    setStatusFilter('');
    setTechnikerFilter('');
    setRedenFilter('');
    setCurrentPage(1); // Reset to first page when clearing filters
  };
  
  if(machine.onderhouden.length === 0){
    return (
      <div className="col-span-full text-center text-gray-500 text-lg font-semibold p-4">
        Geen onderhouden gevonden voor deze machine.
      </div>
    );
  }

  return (
    <div className="flex-col md:flex-row flex justify-between">
      <div className="w-full">
        
        <div className="mb-4 flex flex-wrap items-center justify-between">
          {/* Search input */}
          <div className="flex items-center space-x-3">
            <Search 
              value={zoekterm} 
              onChange={handleSearch} 
              placeholder="Zoeken naar datum, reden, status, ..."
            />
            
            <button
              onClick={toggleFilters}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 
                rounded-md text-sm font-medium transition-colors"
              data-cy="toggle_filters"
            >
              {showFilters ? 'Verberg filters' : 'Toon filters'}
            </button>
          </div>
          
          {/* Page size selector - niet zichtbaar op small screens */}
          <div className="hidden md:flex items-center mt-3 md:mt-0">
            <label htmlFor="page-size" className="mr-2 text-gray-700">
              Aantal onderhouden per pagina:
            </label>
            <select
              id="page-size"
              value={limit}
              onChange={handleLimitChange}
              className="border border-gray-300 rounded-md px-3 py-2"
              data-cy="onderhouden_page_size"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
        
        {/* Filters section that appears/disappears when toggle is clicked */}
        {showFilters && (
          <OnderhoudenFilter
            uniqueStatuses={uniqueStatuses}
            uniqueTechniekers={uniqueTechniekers}
            uniqueRedenen={uniqueRedenen}
            statusFilter={statusFilter}
            technikerFilter={technikerFilter}
            redenFilter={redenFilter}
            setStatusFilter={setStatusFilter}
            setTechnikerFilter={setTechnikerFilter}
            setRedenFilter={setRedenFilter}
            resetFilters={resetFilters}
          />
        )}

        <GenericTable
          data={paginatedOnderhouden}
          columns={{
            'Nr.': 'id',
            'Starttijdstip': 'starttijdstip',
            'Eindtijdstip': 'eindtijdstip',
            'Naam technieker': 'technieker',
            'Reden': 'reden',
            'Opmerkingen': 'opmerkingen',
            'Onderhoudsrapport': 'onderhoudsrapport',
            'Status': 'status',
          }}
          actionsConfig= {{
            'onderhoudsrapport': handleGenerateRapport,
          }}
          onSort={handleSort}
          sortConfig={sortConfig}
          emptyMessage="Er zijn geen sites beschikbaar."
          dataCyPrefix="onderhoud"
        />        

        <div className="mt-4 text-sm text-gray-600">
          {filteredOnderhouden.length} onderhouden gevonden
        </div>

        <Pagination 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          data={filteredOnderhouden} 
          totalPages={filteredOnderhouden.length === 0 ? 1 : Math.ceil(filteredOnderhouden.length / limit)} 
        />
      </div>
    </div>
  );
}