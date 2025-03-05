import Dropdown from '../components/genericComponents/Dropdown';
import TileList from '../components/KPI Tiles/TileList';
import useSWR from 'swr';
import { getAll, save } from '../api';
import AsyncData from '../components/AsyncData';
import useSWRMutation from 'swr/mutation';

const Dashboard = () => {

  const {
    data: dashboards = [],
    loading,
    error,
  } = useSWR('dashboard', getAll);

  const {
    data: kpis = [],
    loadingkpi,
    errorkpi,
  } = useSWR('kpi', getAll);

  const { trigger: addKPIToDashboard, error: addKPIError } = useSWRMutation(
    'dashboard',
    (url, { arg }) => save(url, { arg }),
  );

  const addKPI = (kpi_id) => {
    addKPIToDashboard({ id: 1, kpi_id });
    if (addKPIError) {
      console.error(addKPIError);
    }
  };

  console.log(kpis);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Pagina</h1>
      <AsyncData loading={loadingkpi} error={errorkpi}>
        <Dropdown
          label={'+ Voeg een nieuwe KPI toe'}
          options={kpis}
          onSelect={addKPI}
        />
      </AsyncData>
      <AsyncData loading={loading} error={error}>
        <TileList tiles={dashboards} />
      </AsyncData>
    </div>
  );
};

export default Dashboard;
