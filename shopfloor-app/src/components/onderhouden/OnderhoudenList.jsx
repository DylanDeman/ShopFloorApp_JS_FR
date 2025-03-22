import { useNavigate } from 'react-router';
import OnderhoudTable from './OnderhoudTable';
import { useState } from 'react';
import { Pagination } from '../genericComponents/Pagination';
import Search from '../genericComponents/Search';
import PageHeader from '../genericComponents/PageHeader';

export default function OnderhoudenList({machine}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [zoekterm, setZoekterm] = useState('');

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
  
  const sortOnderhouden = (onderhouden) => {
    if (!sortConfig.field) return onderhouden;
    
    const sortedOnderhouden = [...onderhouden]; 
    
    const integerFields = ['id'];
    const sortFn = integerFields.includes(sortConfig.field) ? sortInteger : sortString;
    
    return sortedOnderhouden.sort((a, b) => 
      sortFn(a, b, sortConfig.field, sortConfig.direction),
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

  const handleOnClickBack = () => {
    navigate(-1);
  };

  const handleShow = (id) => {
    navigate(`../../onderhouden/${id}`);
  };

  const handleSearch = (e) => {
    setZoekterm(e.target.value);
  };
  
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1); 
  };

  const filteredOnderhouden = processedOnderhouden.filter((onderhoud) => {
    return Object.values(onderhoud).some((value) =>
      String(value).toLowerCase().includes(zoekterm.toLowerCase()),
    );
  });

  const sortedOnderhouden = sortOnderhouden(filteredOnderhouden);
  
  const startIndex = (currentPage - 1) * limit;
  const paginatedOnderhouden = sortedOnderhouden.slice(startIndex, startIndex + limit);
  
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
        <PageHeader title={`Onderhoudshistoriek | ${machine.code}`} onBackClick={handleOnClickBack}/>
        <div className="mb-4 flex flex-wrap items-center justify-between">
          {/* Search input */}
          <Search 
            value={zoekterm} 
            onChange={handleSearch} 
            placeholder="Zoeken naar datum, reden, status, ..."
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

        <OnderhoudTable 
          machine={machine} 
          onderhouden={paginatedOnderhouden} 
          onSort={handleSort} 
          sortConfig={sortConfig} 
          show={handleShow}
        />
        
        <div className="mt-6">
          <Pagination 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
            data={processedOnderhouden} 
            totalPages={sortedOnderhouden.length === 0 ? 1 : Math.ceil(sortedOnderhouden.length / limit)} 
          />
        </div>
      </div>
    </div>
  );
}