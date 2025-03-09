import { FaTrash } from 'react-icons/fa';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getKPIWaardenByKPIid } from '../../api';
import useSWR from 'swr';
import AsyncData from '../AsyncData';

const Tile = ({ id, title, content, onDelete, graphType, machines }) => {
  const { data: kpiWaarden = [], loading, error } = useSWR(id, getKPIWaardenByKPIid);

  const handleDelete = () => {
    onDelete(id);
  };

  const formattedData = kpiWaarden.map((item) => ({
    name: new Date(item.datum).toLocaleDateString(),
    value: item.waarde,
  }));

  const renderGraph = () => {
    switch (graphType) {
      case 'LINE':
        return (
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} />
          </LineChart>
        );
      case 'BAR':
        return (
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366F1" />
          </BarChart>
        );
      case 'SINGLE': {
        const lastValue = formattedData.length > 0 ?
          formattedData[formattedData.length - 1].value : 'N/A';
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-9xl font-bold text-blue-500">{lastValue}</p>
          </div>
        );
      }
      case 'LIST':
        return (
          <ul className="list-disc list-inside text-gray-700">
            {formattedData.length > 0 ?
              formattedData.map((item, index) => (
                <li key={index}>{`${item.name}: ${item.value}`}</li>
              )) : (
                <p>
                  Geen data beschikbaar!
                </p>
              )
            }
          </ul>

        );
      default:
        return <p className="text-gray-500">Geen grafiek beschikbaar.</p>;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 m-4 max-w-sm w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          className="text-red-500 hover:text-red-700 p-2 rounded-full focus:outline-none"
          onClick={handleDelete}
        >
          <FaTrash size={20} />
        </button>
      </div>
      <p className="text-gray-700 mb-4">{content}</p>
      <div className="h-48">
        <AsyncData loading={loading} error={error}>
          <ResponsiveContainer width="100%" height="100%">
            {renderGraph()}
          </ResponsiveContainer>
        </AsyncData>
      </div>
    </div>
  );
};

export default Tile;
