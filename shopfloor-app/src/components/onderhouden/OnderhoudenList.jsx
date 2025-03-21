import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
import OnderhoudTable from './OnderhoudTable';
import { useState } from 'react';
import { Pagination } from '../genericComponents/Pagination';
import Search from '../genericComponents/Search';

export default function OnderhoudenList({machine}){

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [zoekterm, setZoekterm] = useState('');

  const [sortConfig, setSortConfig] = useState({
    field: 'id',
    direction: 'asc',
  });

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1); 
  };

  if(machine.onderhouden.length === 0){
    return (
      <div className="col-span-full text-center text-gray-500 text-lg font-semibold p-4">
        Geen onderhouden gevonden voor deze machine.
      </div>
    );
  }

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
  
  const handleSort = (field) => {
    setSortConfig((prevConfig) => ({
      field,
      direction: 
        prevConfig.field === field
          ? prevConfig.direction === 'asc' ? 'desc' : 'asc'
          : 'asc',
    }));
  };

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

  const handleOnClickBack = () => {
    navigate('../');
  };

  const handleShow = (id) => {
    navigate(`../../onderhouden/${id}`);
  };

  const handleSearch = (e) => {
    setZoekterm(e.target.value);
  };

  const sortOnderhouden = (processedOnderhouden) => {
    if (!sortConfig.field) return processedOnderhouden;
    
    const sortedOnderhouden = [...processedOnderhouden]; 
    
    const integerFields = ['id'];
    const sortFn = integerFields.includes(sortConfig.field) ? sortInteger : sortString;
    
    return sortedOnderhouden.sort((a, b) => 
      sortFn(a, b, sortConfig.field, sortConfig.direction),
    );
  };

  const filteredOnderhouden = processedOnderhouden.filter((onderhoud) => {
    return Object.values(onderhoud).some((value) =>
      String(value).toLowerCase().includes(zoekterm.toLowerCase()),
    );
  },
  );

  const sortedOnderhouden = sortOnderhouden(filteredOnderhouden);

  return (
    <div className="flex-col justify-between items-center mb-6 mt-10">
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
      <div className='flex items-center gap-4 mb-8'>
        <button 
          className="text-gray-700 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
          onClick={handleOnClickBack}
          aria-label="Go back"
        >
          <FaArrowLeft size={24} />
        </button>
        <h1 className="text-4xl font-semibold flex">Onderhoudshistoriek [{machine.code}]</h1>
      </div>
      <OnderhoudTable 
        machine={machine} 
        onderhouden={sortedOnderhouden} 
        onSort={handleSort} 
        sortConfig={sortConfig} 
        show={handleShow}/>
        
      <Pagination 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        data={processedOnderhouden} 
        totalPages={processedOnderhouden.length === 0 ? 1 : Math.ceil(processedOnderhouden.length / limit)} />
    </div>
  );
}