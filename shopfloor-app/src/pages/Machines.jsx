import useSWR from 'swr';
import { getAll } from '../api';
import MachineList from './onderhouden_machines/MachineList';
import AsyncData from '../components/AsyncData';
import Information from '../components/Information';
import { IoInformationCircleOutline } from 'react-icons/io5';
import PageHeader from '../components/genericComponents/PageHeader';

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