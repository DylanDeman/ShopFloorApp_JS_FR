import Dropdown from '../components/genericComponents/Dropdown';
import TileList from '../components/KPI Tiles/TileList';
import useSWR from 'swr';
import { getAll, getDashboardByUserID, deleteById, post } from '../api';
import AsyncData from '../components/AsyncData';
import useSWRMutation from 'swr/mutation';
import { useAuth } from '../contexts/auth';

const Dashboard = () => {
  const { user } = useAuth();
  const user_id = user ? user.id : null;
  const rol = user ? user.rol : null;

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
    (url, { arg }) => post(url, { arg: { gebruiker_id: arg.user_id, kpi_id: arg.kpi_id } }),
  );

  const addKPI = async (kpi_id) => {
    if (!user_id) return;

    try {
      console.log(`User_id: ${user_id}`);
      console.log(`KPI_id: ${kpi_id}`);

      await addKPIToDashboard({ user_id, kpi_id });
      window.location.reload();
    } catch (error) {
      console.error(`Error trying to add KPI to dashboard: ${error}`);
      console.error(addKPIError);
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
      console.error(deleteError);
    }
  };

  const selectedKpiIds = new Set(dashboards.map((d) => d.kpi_id));

  const selectedTiles = Array.isArray(kpis.items) ? kpis.items.filter((kpi) => selectedKpiIds.has(kpi.id)) : [];

  const availableKpis = Array.isArray(kpis.items) ? kpis.items.filter((kpi) => !selectedKpiIds.has(kpi.id)) : [];
  const correctRoleKpis = Array.isArray(kpis.items) ? availableKpis.filter((kpi) => kpi.roles.includes(rol)) : [];

  return (
    <div className="p-6">
      <AsyncData loading={loadingkpi} error={errorkpi}>
        <Dropdown
          label={'+ Voeg een nieuwe KPI toe'}
          options={correctRoleKpis}
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
