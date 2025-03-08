import SiteList from './SiteList';
import Information from '../../components/Information';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { FaPerson } from 'react-icons/fa6';
import { FaMapMarkedAlt } from 'react-icons/fa';

const Sites = () => {

  const handleShowGrondplan = () => {
    window.alert('Grondplan tonen' + '\nTODO nog te implementeren');
    // TODO navigeren naar ander scherm!!!
  };
  
<<<<<<< HEAD
  return (
    <>
      <div className="flex justify-between items-center mb-6 mt-10">
        <h1 className="text-4xl font-semibold"> 
          PAGINA WIP - Site - [naam van de site]
        </h1>
        <button 
          className="bg-red-500 hover:cursor-pointer hover:bg-red-700 
          text-white font-bold py-2 px-4 
          rounded flex items-center gap-2"
          onClick={() => handleShowGrondplan()}
        >
          <FaMapMarkedAlt />
          Grondplan bekijken
        </button>
      </div>

      <Information 
        info="Hieronder vindt u een overzicht van alle sites. 
        Klik op een site om een site te raadplegen
        en zijn machines te bekijken."
        icon={IoInformationCircleOutline}
      />

      <Information 
        info="Verantwoordelijke: [naam van de verantwoordelijke]"
        icon={FaPerson}
      />
      
      {/* TIJDELIJKE LIJST */}
      <SiteList/>
    </>
  );

  const gesorteerdeMachines = sorteerMachines(filteredMachines);

  return (
    <div className="flex-col md:flex-row flex justify-between p-6" data-cy="site-details">
      <div className="w-full md:ml-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Zoek op locatie, status of productie status..."
            value={zoekterm}
            onChange={handleSearch}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
            data-cy="filter-input"
          />
        </div>
        <AsyncData error={siteError} loading={siteLoading}>
          <MachineTable 
            machines={gesorteerdeMachines} 
            onSort={handleSort} 
            sorteerVolgorde={sorteerVolgorde} 
          />
        </AsyncData>
=======
  return (
    <>
      <div className="flex justify-between items-center mb-6 mt-10">
        <h1 className="text-4xl font-semibold"> 
          PAGINA WIP - Site - [naam van de site]
        </h1>
        <button 
          className="bg-red-500 hover:cursor-pointer hover:bg-red-700 
          text-white font-bold py-2 px-4 
          rounded flex items-center gap-2"
          onClick={() => handleShowGrondplan()}
        >
          <FaMapMarkedAlt />
          Grondplan bekijken
        </button>
>>>>>>> origin/feature/raadplegen_details_site_update
      </div>

      <Information 
        info="Hieronder vindt u een overzicht van alle sites. 
        Klik op een site om een site te raadplegen
        en zijn machines te bekijken."
        icon={IoInformationCircleOutline}
      />

      <Information 
        info="Verantwoordelijke: [naam van de verantwoordelijke]"
        icon={FaPerson}
      />
      
      {/* TIJDELIJKE LIJST */}
      <SiteList/>
    </>
  );
};

<<<<<<< HEAD
export default SiteDetail;
=======
export default Sites;
>>>>>>> origin/feature/raadplegen_details_site_update
