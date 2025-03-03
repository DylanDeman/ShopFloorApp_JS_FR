import { FaTrash } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getKPIWaardenByKPIid } from '../../api';
import useSWR from 'swr';
import AsyncData from '../AsyncData';

const Tile = ({ id, title, content }) => {

  const { data: kpiWaarden = [], loading, error } = useSWR(id, getKPIWaardenByKPIid);

  // Format the data for the chart
  const formattedData = kpiWaarden.map((item) => ({
    name: new Date(item.datum).toLocaleDateString(), // Convert datum to a readable string for XAxis
    value: item.waarde, // Use the 'waarde' for the Y-axis
  }));

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 m-4 max-w-sm w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          className="text-red-500 hover:text-red-700 p-2 rounded-full focus:outline-none"
        >
          <FaTrash size={20} />
        </button>
      </div>
      <p className="text-gray-700 mb-4">{content}</p>
      <div className="h-48">
        <AsyncData loading={loading} error={error}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </AsyncData>
      </div>
    </div>
  );
};

export default Tile;
