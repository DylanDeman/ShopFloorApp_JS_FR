import MachineList from '../../components/Sites/siteDetailComponents/MachinesList';
import Information from '../../components/Information';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { FaPerson } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { getById } from '../../api/index';
import AsyncData from '../../components/AsyncData';
import { IoMdAddCircleOutline } from 'react-icons/io';
import PageHeader from '../../components/genericComponents/PageHeader';
import GenericButton from '../../components/genericComponents/GenericButton';

const SiteDetails = () => {
  const { id } = useParams();
  const idAsNumber = Number(id);
  const navigate = useNavigate();
  
  const handleShowGrondplan = () => {
    navigate(`/sites/${id}/grondplan`);
  };

  const handleOnClickBack = () => {
    navigate('/sites');
  };

  const handleAddMachine = () => {
    navigate('/machines/new');
  };
    
  const {
    data: site = [],
    error: siteError,
    isLoading: siteLoading,
  } = useSWR(id ? `sites/${idAsNumber}` : null, getById);
    
  return (
    <>
      <AsyncData error={siteError} loading={siteLoading}>
        <div data-cy="site-details" className="flex justify-between items-center">
          <PageHeader title={`Site | ${site.naam}`} onBackClick={handleOnClickBack}/>
          <div className="flex gap-4 items-center">
            <GenericButton icon={FaMapMarkedAlt} onClick={handleShowGrondplan} text="Bekijk grondplan"/>
            <GenericButton icon={IoMdAddCircleOutline} onClick={handleAddMachine} text="Machine toevoegen"/>
          </div>
        </div>

        <Information 
          info="Hieronder vindt u de gegevens van deze site en zijn machines. Klik op een machine voor meer informatie."
          icon={IoInformationCircleOutline}
        />

        <Information 
          info={'Verantwoordelijke: ' + site.verantwoordelijke?.naam + ' ' + site.verantwoordelijke?.voornaam}
          icon={FaPerson}
        />
      
        {/* Lijst met alle machines*/}
        <MachineList machinesData={site.machines}/>
      </AsyncData>
    </>
  );
};

export default SiteDetails;