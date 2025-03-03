import Dropdown from '../components/genericComponents/Dropdown';
import TileList from '../components/KPI Tiles/TileList';
import useSWR from 'swr';
import { getAll } from '../api';
import AsyncData from '../components/AsyncData';

const Dashboard = () => {

  const {
    data: tiles = [],
    loading,
    error,
  } = useSWR('kpi', getAll);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Pagina</h1>
      <Dropdown
        label={'+ Voeg een nieuwe KPI toe'}
        options={['optie 1', 'optie 2', 'optie 3']}
      />
      <AsyncData loading={loading} error={error}>
        <TileList tiles={tiles} />
      </AsyncData>
    </div>
  );
};

export default Dashboard;
