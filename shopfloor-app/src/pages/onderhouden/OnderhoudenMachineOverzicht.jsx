import { useParams } from 'react-router';
import AsyncData from '../../components/AsyncData';
import { getById } from '../../api';
import useSWR from 'swr';
import OnderhoudList from '../../components/onderhouden/OnderhoudOverzichtComponents/OnderhoudList';
import PageHeader from '../../components/genericComponents/PageHeader';
import { useNavigate } from 'react-router-dom';
import Information from '../../components/Information';
import { IoInformationCircleOutline } from 'react-icons/io5';

export default function OnderhoudenMachineOverzicht () {
  const navigate = useNavigate();

  const {id} = useParams();
  const {
    data: machine,
    isLoading,
    error,
  } = useSWR(`machines/${id}`, getById);

  const handleBackClick = () => {
    navigate('/machines');
  };

  return (
    <>
      <PageHeader title={`Onderhoudshistoriek | ${machine?.code}`} onBackClick={handleBackClick}/>

      <Information 
        info="Hieronder vindt u een overzicht van de onderhouden van deze machine.
          U kunt een rapport genereren door op de knop 'Genereer rapport' te klikken."
        icon={IoInformationCircleOutline}
      />
     
      <AsyncData loading={isLoading} error={error}>
        <OnderhoudList machine={machine}/>
      </AsyncData>
    </>
  );
}