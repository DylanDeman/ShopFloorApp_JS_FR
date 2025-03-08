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
    <div className="flex-col md:flex-row flex justify-between p-6" data-cy="site-grondplan-container">
      <div className="w-full md:ml-6" data-cy="site-grondplan-content">
        
        <AsyncData error={siteError} loading={siteLoading} data-cy="async-data">
          <Grondplan machines={machines} data-cy="grondplan-component" />
        </AsyncData>
      </div>
    </div>
  );
};

export default SiteGrondPlan;
