import SiteList from '../../components/Sites/siteOverzichtComponents/SiteList';
import Information from '../../components/Information';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import PageHeader from '../../components/genericComponents/PageHeader';
import GenericButton from '../../components/genericComponents/GenericButton';

const SitesOverzicht = () => {
  const navigate = useNavigate();
  const handleAddSite = () => {
    navigate('/sites/create');
  };
  
  return (
    <>
      <div className="flex justify-between items-center">
        <PageHeader title="Sites" />
        <GenericButton icon={IoMdAddCircleOutline} onClick={handleAddSite} text="Site toevoegen"/>
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