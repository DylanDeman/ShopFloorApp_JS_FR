import MachineTable from '../../components/machines/MachineTable';
import { useState } from 'react';
import useSWR from 'swr';
import { getById } from '../../api';
import AsyncData from '../../components/AsyncData';
import { useParams } from 'react-router-dom';
import Grondplan from '../../components/machines/Grondplan';

const SiteDetail = () => {
  const { id } = useParams();
  const idAsNumber = Number(id);
    
  const {
    data: site = [],
    error: siteError,
    isLoading: siteLoading,
  } = useSWR(id ? `sites/${idAsNumber}` : null, getById);

  const machines = site.machines || [];

  const [sorteerVolgorde, setSorteerVolgorde] = useState(null);
  const [zoekterm, setZoekterm] = useState('');

  const sorteerMachines = (machines) => {
    if (!sorteerVolgorde) return machines;
    return [...machines].sort((a, b) =>
      sorteerVolgorde === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status),
    );
  };

  const handleSort = () => {
    setSorteerVolgorde((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleSearch = (e) => {
    setZoekterm(e.target.value);
  };

  const filteredMachines = machines.filter((machine) =>
    machine.locatie.toLowerCase().includes(zoekterm.toLowerCase()) ||
    machine.status.toLowerCase().includes(zoekterm.toLowerCase()) ||
    machine.productieStatus.toLowerCase().includes(zoekterm.toLowerCase()),
  );

  const gesorteerdeMachines = sorteerMachines(filteredMachines);

  return (
    <div className="flex-col md:flex-row flex justify-between p-6">
      <div className="w-full md:ml-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Zoek op locatie, status of productie status..."
            value={zoekterm}
            onChange={handleSearch}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
        </div>
        <AsyncData error={siteError} loading={siteLoading}>
          {/* <MachineTable machines={gesorteereMachines} onSort={handleSort} sorteerVolgorde={sorteerVolgorde} /> */}
          <Grondplan  machines={gesorteerdeMachines} onSort={handleSort} sorteerVolgorde={sorteerVolgorde}/>
        </AsyncData>
      </div>
    </div>
  );
};

export default SiteDetail;