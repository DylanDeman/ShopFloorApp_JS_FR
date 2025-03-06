import Dropdown from '../components/genericComponents/Dropdown';
import TileList from '../components/KPI Tiles/TileList';
import useSWR from 'swr';
import { getAll, save, getDashboardByUserID, deleteById } from '../api';
import AsyncData from '../components/AsyncData';
import useSWRMutation from 'swr/mutation';
import { useAuth } from '../contexts/auth';

const Dashboard = () => {
  const { user } = useAuth();
  const user_id = user ? user.id : null;

  const {
    data: dashboards = [],
    loading,
    error,
  } = useSWR(user_id, getDashboardByUserID);

  const {
    data: kpis = [],
    loading: loadingkpi,
    error: errorkpi,
  } = useSWR('kpi', getAll);

  const {
    trigger: deleteKPI, error: deleteError,
  } = useSWRMutation('dashboard', deleteById);

  const { trigger: addKPIToDashboard, error: addKPIError } = useSWRMutation(
    'dashboard',
    (url, { arg }) => save(url, { arg }),
  );

  const addKPI = (kpi_id) => {
    addKPIToDashboard({ id: 1, kpi_id });
    if (addKPIError) {
      console.error(addKPIError);
      console.error(deleteError);
    }
  };

  const handleDelete = async (kpi_id) => {
    try {
      const dashboard = dashboards.find((item) => item.kpi_id === kpi_id);
      if (!dashboard) return;

      await deleteKPI(dashboard.id);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const selectedKpiIds = new Set(dashboards.map((d) => d.kpi_id));

  const selectedTiles = kpis.filter((kpi) => selectedKpiIds.has(kpi.id));

  const availableKpis = kpis.filter((kpi) => !selectedKpiIds.has(kpi.id));

  return (
    <div className="p-6">
      <AsyncData loading={loadingkpi} error={errorkpi}>
        <Dropdown
          label={'+ Voeg een nieuwe KPI toe'}
          options={availableKpis}
          onSelect={addKPI}
        />
      </AsyncData>
      <AsyncData loading={loading} error={error}>
        <TileList tiles={selectedTiles} onDelete={handleDelete} />
      </AsyncData>
    </div>
  );
};

export default Dashboard;
