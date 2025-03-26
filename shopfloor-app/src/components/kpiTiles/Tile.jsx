import { FaTrash } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getById } from '../../api';
import useSWR from 'swr';
import AsyncData from '../AsyncData';
import { Suspense, useState } from 'react';
import { useAuth } from '../../contexts/auth';
import Loader from '../Loader';
import { useNavigate } from 'react-router-dom';
import { StatusDisplay } from '../../components/genericComponents/StatusDisplay';

const Tile = ({ id, title, content, onDelete, graphType, machines, onderhouden }) => {
  const { data: kpiWaarden = [], loading, error } = useSWR(`kpi/${id}/kpiwaarden`, getById);
  const [selectedSite, setSelectedSite] = useState(null);

  const { user } = useAuth();
  const user_id = user ? user.id : null;

  const navigate = useNavigate();

  const handleDelete = () => {
    onDelete(id);
  };

  const handleSiteChange = (event) => {
    setSelectedSite(event.target.value ? Number(event.target.value) : null);
  };

  let formattedData = [];
  if (kpiWaarden && Array.isArray(kpiWaarden.items)) {
    formattedData = kpiWaarden.items.map((item) => ({
      name: new Date(item?.datum),
      value: item?.waarde,
      site_id: item?.site_id,
    }));
  }

  const uniqueSites = [...new Set(formattedData.map((item) => item?.site_id).filter(Boolean))];

  const datum = new Date();
  datum.toISOString();

  const renderGraph = () => {

    switch (graphType) {
      case 'BARHOOGLAAG':
        return (
          <BarChart data={[...formattedData].sort((a, b) => b.value - a.value)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              label={{ value: 'Site', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{ value: 'Productiegraad', angle: -90, position: 'outsideTop', dx: -30 }}
            />
            <Tooltip
              formatter={(value, name, props) => {
                const siteId = props?.payload?.site_id;
                const formattedValue = value;

                return [
                  `Site: ${siteId !== undefined ? siteId : 'N/A'}`,
                  `Productiegraad: ${formattedValue}`,
                ];
              }}
              labelFormatter={() => ''}
            />
            <Bar dataKey="value" fill="#6366F1" />
          </BarChart>
        );

      case 'BARLAAGHOOG':
        return (
          <BarChart data={[...formattedData].sort((a, b) => a.value - b.value)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              label={{ value: 'Site', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{ value: 'Productiegraad', angle: -90, position: 'outsideTop', dx: -30 }}
            />
            <Tooltip
              formatter={(value, name, props) => {
                const siteId = props?.payload?.site_id;
                const formattedValue = value;

                return [
                  `Site: ${siteId !== undefined ? siteId : 'N/A'}`,
                  `Productiegraad: ${formattedValue}`,
                ];
              }}
              labelFormatter={() => ''}
            />
            <Bar dataKey="value" fill="#6366F1" />
          </BarChart>
        );

      case 'SITES': {
        const siteGezondheden = formattedData.filter((kpi) => kpi?.site_id != null);
        const selectedSiteData = siteGezondheden.filter((kpi) => Number(kpi?.site_id) === selectedSite);

        return (
          <div className="space-y-4">
            <div className="mb-4">
              <label htmlFor="siteSelect" className="block text-gray-700 font-semibold mb-2">
                Selecteer een site:
              </label>
              <select
                id="siteSelect"
                className="border border-gray-300 rounded p-2 w-full"
                onChange={handleSiteChange}
                value={selectedSite || ''}
              >
                <option value="" disabled>-- Selecteer een site --</option>

                {uniqueSites.map((siteId) => (
                  <option key={siteId} value={siteId}>
                    Site {siteId}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-lg p-6 w-full flex flex-col">
              <Suspense fallback={<Loader />}>
                <h3 className="text-xl font-semibold mb-2">Site
                  {selectedSiteData.length === 0 ? '' : ' ' + selectedSiteData[0].site_id}
                </h3>
                <p className="text-8xl font-bold text-blue-500">
                  {selectedSiteData.length === 0 ? '' : `${(parseFloat(selectedSiteData[0].value)).toFixed(0)}%`}
                </p>
              </Suspense>
            </div>
          </div>
        );
      }

      case 'SINGLE': {
        const lastValue = formattedData.length > 0 ?
          formattedData[formattedData.length - 1].value : 'N/A';

        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-9xl font-bold text-blue-500">{lastValue}</p>
          </div>
        );
      }

      case 'GEZONDHEID': {
        const lastValue = formattedData.length > 0
          ? formattedData[formattedData.length - 1].value
          : 'N/A';

        const percentage = lastValue !== 'N/A'
          ? `${(parseFloat(lastValue)).toFixed(0)}%`
          : 'N/A';

        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-9xl font-bold text-blue-500">{percentage}</p>
          </div>
        );
      }

      case 'MACHLIST': {
        if (kpiWaarden.length === 0 || machines.length === 0) {
          return <p className="text-gray-500">Geen data beschikbaar.</p>;
        }

        const machineList = machines.items;
        const filteredMachines = machineList.filter(
          (machine) => machine.technieker?.id === user_id || machine.site.verantwoordelijke.id === user_id,
        );

        return (
          <div className="overflow-x-auto">
            {filteredMachines.length > 0 ? (
              <div className="flex space-x-4 p-2">
                {filteredMachines.map((machine) => (
                  <div
                    key={machine.id}
                    className="border rounded-lg p-4 bg-gray-50 shadow cursor-pointer min-w-[250px]"
                    onClick={() => navigate(`/machines/${machine.id}`)}
                  >
                    <h3 className="text-lg font-semibold text-blue-600">
                      Machine {machine.id}
                    </h3>
                    <p className="text-gray-700">
                      <strong>Code:</strong> {machine.code} <br />
                      <strong>Locatie:</strong> {machine.locatie} <br />
                      <strong>Status:</strong> {machine.status} <br />
                      <strong>Product info:</strong> {machine.product.naam} <br />
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Geen relevante machines gevonden.</p>
            )}
          </div>
        );
      }

      case 'TOP5': {
        if (kpiWaarden.length === 0 || machines.length === 0) {
          return <p className="text-gray-500">Geen data beschikbaar.</p>;
        }

        const mostRecentKPI = kpiWaarden.items
          .sort((a, b) => new Date(b.datum) - new Date(a.datum))
          .slice(0, 1);

        const firstFiveIDs = mostRecentKPI
          .flatMap((kpi) => kpi.waarde.split(',').map(Number))
          .slice(0, 5);

        const machineList = machines.items;
        const filteredMachines = machineList.filter((machine) =>
          firstFiveIDs.includes(machine.id),
        );

        return (
          <div className="overflow-x-auto">
            {filteredMachines.length > 0 ? (
              <div className="flex space-x-4 p-2">
                {filteredMachines.map((machine) => (
                  <div
                    key={machine.id}
                    className="border rounded-lg p-4 bg-gray-50 shadow cursor-pointer min-w-[250px]"
                    onClick={() => navigate(`/machines/${machine.id}`)}
                  >
                    <h3 className="text-lg font-semibold text-blue-600">
                      Machine {machine.id}
                    </h3>
                    <p className="text-gray-700">
                      <strong>Code:</strong> {machine.code} <br />
                      <strong>Locatie:</strong> {machine.locatie} <br />
                      <strong>Status:</strong> {machine.status} <br />
                      <strong>Product:</strong> {machine.product.naam} <br />
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Geen relevante machines gevonden.</p>
            )}
          </div>
        );
      }

      case 'TOP5OND': {
        if (kpiWaarden.length === 0 || onderhouden.length === 0) {
          return <p className="text-gray-500">Geen data beschikbaar.</p>;
        }

        const onderhoudList = onderhouden.items;

        const filteredOnderhouden = onderhoudList.filter((onderhoud) =>
          onderhoud.technieker.id == user_id,
        ).slice(0, 5);

        return (
          <div className="overflow-x-auto">
            {filteredOnderhouden.length > 0 ? (
              <div className="flex space-x-4">
                {filteredOnderhouden.map((onderhoud) => (

                  < div key={onderhoud.id} className="min-w-max border rounded-lg p-4 bg-gray-50 shadow cursor-pointer"
                    onClick={() => navigate(`/machines/${onderhoud.machine_id}/onderhouden`)}
                  >
                    <h3 className="text-lg font-semibold text-blue-600">
                      Onderhoud {onderhoud.id}
                    </h3>
                    <p className="text-gray-700">
                      <strong>Starttijd:</strong> {new Date(onderhoud.starttijdstip).toLocaleDateString()} <br />
                      <strong>Eindtijd:</strong> {new Date(onderhoud.eindtijdstip).toLocaleDateString()} <br />
                      <strong>Status:</strong> <StatusDisplay status={onderhoud.status} /> <br />
                      <strong>Reden:</strong> {onderhoud.reden} <br />
                      <strong>Opmerkingen:</strong> {onderhoud.opmerkingen} <br />
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Geen onderhouden gevonden.</p>
            )
            }
          </div >
        );
      }

      case 'AANKOND': {
        const kpiIds = kpiWaarden?.items?.map((kpi) => kpi.waarde.split(',').map(Number)).flat() || [];

        const onderhoudList = onderhouden.items;

        const gefilterdeOnderhouden = onderhoudList.filter(
          (onderhoud) => kpiIds.includes(onderhoud.id) && onderhoud.technieker.id === user_id,
        );

        return (
          <div className="overflow-x-auto">
            {gefilterdeOnderhouden.length > 0 ? (
              <div className="flex space-x-4">
                {gefilterdeOnderhouden.map((onderhoud) => (
                  <div
                    key={onderhoud.id}
                    className="min-w-max border rounded-lg p-4 bg-gray-50 shadow cursor-pointer"
                    onClick={() => navigate(`/machines_onderhouden/${onderhoud.machine_id}`)}
                  >
                    <h3 className="text-lg font-semibold text-blue-600">
                      Onderhoud {onderhoud.id}
                    </h3>
                    <p className="text-gray-700">
                      <strong>Starttijd:</strong> {new Date(onderhoud.starttijdstip).toLocaleDateString()} <br />
                      <strong>Eindtijd:</strong> {new Date(onderhoud.eindtijdstip).toLocaleDateString()} <br />
                      <strong>Status:</strong> {onderhoud.status} <br />
                      <strong>Reden:</strong> {onderhoud.reden} <br />
                      <strong>Opmerkingen:</strong> {onderhoud.opmerkingen} <br />
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Geen onderhouden gevonden.</p>
            )}
          </div>
        );
      }

      default:
        return <p className="text-gray-500">Geen grafiek beschikbaar.</p>;
    }
  };

  return (
    <div
      className={'bg-white shadow-lg rounded-lg p-6 m-4 flex flex-col w-full'}
    >
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
      <div className="h-auto min-h-[192px] flex flex-col">
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
