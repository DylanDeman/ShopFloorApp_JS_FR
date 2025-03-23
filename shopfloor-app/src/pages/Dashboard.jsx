import Dropdown from '../components/genericComponents/Dropdown';
import TileList from '../components/kpiTiles/TileList';
import useSWR from 'swr';
import { getDashboardByUserID, deleteById, post, getKPIsByRole, getAll } from '../api';
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
    data: machines = [],
    loadingMachines,
    errorMachines,
  } = useSWR('machines', getAll);

  const {
    data: onderhouden = [],
    loadingOnderhouden,
    errorOnderhouden,
  } = useSWR('onderhouden', getAll);

  const {
    data: kpis = [],
    loading: loadingkpi,
    error: errorkpi,
  } = useSWR(user ? user.rol : null, getKPIsByRole);

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

  const gekozenKPIids = new Set(dashboards.map((d) => d.kpi_id));
  const gekozenKPIs = Array.isArray(kpis) ? kpis.filter((kpi) => gekozenKPIids.has(kpi.id)) : [];
  const beschikbareKPIs = Array.isArray(kpis) ? kpis.filter((kpi) => !gekozenKPIids.has(kpi.id)) : [];

  return (
    <div className="p-6">
      <AsyncData loading={loadingkpi} error={errorkpi}>
        {beschikbareKPIs.length > 0 ? (
          <Dropdown
            label={'+ Voeg een nieuwe KPI toe'}
            options={beschikbareKPIs}
            onSelect={addKPI}
            
          />
        ) : (
          <>
          </>
        )}
      </AsyncData>
      <AsyncData loading={loading || loadingMachines || loadingOnderhouden}
        error={error || errorMachines || errorOnderhouden}>
        <TileList tiles={gekozenKPIs} onDelete={handleDelete} machines={machines} onderhouden={onderhouden} />
      </AsyncData>
    </div>
  );
};

export default Dashboard;
