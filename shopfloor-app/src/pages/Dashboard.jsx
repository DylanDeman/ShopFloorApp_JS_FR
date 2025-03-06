import Dropdown from '../components/genericComponents/Dropdown';
import TileList from '../components/KPI Tiles/TileList';
import useSWR from 'swr';
import { getAll, save, getDashboardByUserID } from '../api';
import AsyncData from '../components/AsyncData';
import useSWRMutation from 'swr/mutation';
import { useAuth } from '../contexts/auth';

const Dashboard = () => {

  const { user } = useAuth();
  const user_id = user ? user.id : null;

  const {
    data: dashboard = [],
    loading,
    error,
  } = useSWR(user_id, getDashboardByUserID);

  const filterTiles = () => {
    const kpi_ids = dashboard.map((d) => d.kpi_id);

    const tiles = kpis.filter((kpi) => kpi_ids.includes(kpi.id));

    return tiles;
  };

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
        <TileList tiles={filterTiles()} />
      </AsyncData>
    </div>
  );
};

export default Dashboard;
