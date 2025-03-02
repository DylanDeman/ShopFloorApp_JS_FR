import TileList from '../components/KPI Tiles/TileList';

const Dashboard = () => {
  const tiles = [
    {
      title: 'KPI 1',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      title: 'KPI 2',
      content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Pagina</h1>
      <TileList tiles={tiles} />
    </div>
  );
};

export default Dashboard;
