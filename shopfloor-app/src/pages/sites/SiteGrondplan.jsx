import useSWR from 'swr';
import { getById } from '../../api';
import AsyncData from '../../components/AsyncData';
import { useParams } from 'react-router-dom';
import Grondplan from '../../components/machines/Grondplan';

const SiteGrondPlan = () => {
  const { id } = useParams();
  const idAsNumber = Number(id);
    
  const {
    data: site = [],
    error: siteError,
    isLoading: siteLoading,
  } = useSWR(id ? `sites/${idAsNumber}` : null, getById);

  const machines = site.machines || [];

  return (
    <div className="flex-col md:flex-row flex justify-between p-6">
      <div className="w-full md:ml-6">
        
        <AsyncData error={siteError} loading={siteLoading}>
          <Grondplan  machines={machines}/>
        </AsyncData>
      </div>
    </div>
  );
};

export default SiteGrondPlan;