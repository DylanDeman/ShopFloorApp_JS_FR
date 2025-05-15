import SiteList from '../../components/sites/siteOverzichtComponents/SiteList';
import Information from '../../components/Information';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import PageHeader from '../../components/genericComponents/PageHeader';
import GenericButton from '../../components/genericComponents/GenericButton';
import AsyncData from '../../components/AsyncData';
import useSWR from 'swr';
import { getAll } from '../../api/index';
import { useAuth } from '../../contexts/auth';

const SitesOverzicht = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  const handleAddSite = () => {
    navigate('/sites/new');
  };

  const {
    data: sites = [],
    isLoading,
    error,
  } = useSWR('sites', getAll);
  
  return (
    <>
      {/* Pagina titel en knop om een site toe te voegen */}
      <div className="flex justify-between items-center">
        <PageHeader title="Sites" />
        {role === 'MANAGER' && 
            <GenericButton icon={IoMdAddCircleOutline} onClick={handleAddSite} 
              text="Site toevoegen" dataCy="add-site-button" />
        }
      </div>

      {/* Informatie over de sites */}
      <Information 
        info="Hieronder vindt u een overzicht van alle sites. 
        Klik op een site om de details van de site te bekijken!"
        icon={IoInformationCircleOutline}
      />
      
      {/* Lijst met alle sites*/}
      <AsyncData loading={isLoading} error={error}>
        <SiteList data={sites} />
      </AsyncData>
    </>
  );
};

export default SitesOverzicht;