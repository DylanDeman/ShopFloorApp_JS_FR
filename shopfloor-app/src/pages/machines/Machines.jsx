import useSWR from 'swr';
import AsyncData from '../../components/AsyncData';
import { getAll } from '../../api/index';
import Information from '../../components/Information';
import { IoInformationCircleOutline } from 'react-icons/io5';
import PageHeader from '../../components/genericComponents/PageHeader';
import MachineList from '../onderhouden_machines/MachineList';

const Machines = () => {

  const {
    data: machines = [],
    isLoading,
    error,
  } = useSWR('machines', getAll);

  return (
    <>
      <PageHeader title="Overzicht machines" />
      <Information
        info={
          'Hieronder vindt u een overzicht van machines.\
          Klik op een machine om zijn onderhoudsgeschiedenis te bekijken.'
        }
        icon={IoInformationCircleOutline}
      />
      <AsyncData loading={isLoading} error={error}>
        <MachineList machinesData={machines}/>
      </AsyncData>
    </>
  );
};
export default Machines;