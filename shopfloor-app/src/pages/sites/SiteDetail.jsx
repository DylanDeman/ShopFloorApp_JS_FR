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
};

export default Sites;