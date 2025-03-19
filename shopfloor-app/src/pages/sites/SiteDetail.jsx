import MachineList from './../machines/MachinesList';
import Information from '../../components/Information';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { FaPerson } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { getById } from '../../api/index';
import AsyncData from '../../components/AsyncData';
import { FaArrowLeft } from 'react-icons/fa';
import { IoMdAddCircleOutline } from 'react-icons/io';

const SiteDetails = () => {
  const navigate = useNavigate();
  
  const handleShowGrondplan = () => {
    navigate(`/sites/${id}/grondplan`);
  };

  const handleOnClickBack = () => {
    navigate('/sites');
  };

  const handleAddMachine = () => {
    navigate(`/sites/${id}/machines/new`);
  };

  const { id } = useParams();
  const idAsNumber = Number(id);
    
  const {
    data: site = [],
    error: siteError,
    isLoading: siteLoading,
  } = useSWR(id ? `sites/${idAsNumber}` : null, getById);
    
  return (
    <>
      <AsyncData error={siteError} loading={siteLoading}>
        <div data-cy="site-details" className="flex justify-between items-center mb-6 mt-10">
          <div className="flex items-center gap-4">
            <button 
              className="text-gray-700 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
              onClick={handleOnClickBack}
              aria-label="Go back"
            >
              <FaArrowLeft size={24} />
            </button>
    
            <h1 className="text-4xl font-semibold"> 
              Site | {site.naam}
            </h1>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              className="bg-red-500 hover:cursor-pointer hover:bg-red-700 
                text-white font-bold py-2 px-4 
                rounded flex items-center gap-2"
              onClick={() => handleShowGrondplan()}
            >
              <FaMapMarkedAlt />
              Bekijk grondplan
            </button>
            <button 
              className="bg-red-500 hover:cursor-pointer hover:bg-red-700 
                text-white font-bold py-2 px-4 
                rounded flex items-center gap-2"
              onClick={() => handleAddMachine()}
            >
              <IoMdAddCircleOutline />
              Machine toevoegen
            </button>
          </div>
        </div>

        <Information 
          info="Hieronder vindt u een overzicht van alle sites. 
        Klik op een site om een site te raadplegen 
        en zijn machines te bekijken."
          icon={IoInformationCircleOutline}
        />

        <Information 
          info={'Verantwoordelijke: ' + site.verantwoordelijke?.naam + ' ' + site.verantwoordelijke?.voornaam}
          icon={FaPerson}
        />
      
        {/* Lijst met alle machines*/}
        <MachineList
          machinesData={site.machines}
        />
      </AsyncData>
    </>
  );
};

export default SiteDetails;