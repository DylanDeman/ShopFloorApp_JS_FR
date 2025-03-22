import SiteList from '../../components/Sites/siteOverzichtComponents/SiteList';
import Information from '../../components/Information';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import PageHeader from '../../components/genericComponents/PageHeader';

const SitesOverzicht = () => {
  const navigate = useNavigate();
  const handleAddSite = () => {
    navigate('/sites/create');
  };
  
  return (
    <>
      <div className="flex justify-between items-center">
        <PageHeader title="Sites" />
        <button 
          className="bg-red-500 hover:cursor-pointer hover:bg-red-700 
          text-white font-bold py-2 px-4 
          rounded flex items-center gap-x-2"
          onClick={() => handleAddSite()}
        >
          <IoMdAddCircleOutline />
          Site toevoegen
        </button>
      </div>

      <Information 
        info="Hieronder vindt u een overzicht van alle sites. 
        Klik op een site om de details van de site te bekijken!"
        icon={IoInformationCircleOutline}
      />
      
      {/* Lijst met alle sites*/}
      <SiteList/>
    </>
  );
};

export default SitesOverzicht;