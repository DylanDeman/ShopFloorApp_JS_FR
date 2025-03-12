import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAll, createSite } from '../../api';
import AsyncData from '../../components/AsyncData';

export default function SiteToevoegen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    naam: '',
    verantwoordelijke_id: '',
    status: 'ACTIEF',
    machines_ids: [],
  });
  const [verantwoordelijken, setVerantwoordelijken] = useState([]);
  const [availableMachines, setAvailableMachines] = useState([]);
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const formatMachineDisplay = (machine) => {
    if (machine.code && machine.locatie) {
      return `${machine.code} - ${machine.locatie}`;
    }
    if (machine.code) {
      return machine.code;
    }
    if (machine.locatie) {
      return machine.locatie;
    }
    return `Machine #${machine.id}`;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [verantwoordelijkenData, machinesResponse] = await Promise.all([
          getAll('users'),
          getAll('machines'),
        ]);

        const filteredVerantwoordelijken = Array.isArray(verantwoordelijkenData.items)
          ? verantwoordelijkenData.items.filter((user) => {
            try {
              if (typeof user.rol === 'string') {
                const cleanedRol = user.rol.replace(/\\/g, '');
                const parsedRol =
                    cleanedRol.startsWith('"') && cleanedRol.endsWith('"')
                      ? cleanedRol.slice(1, -1)
                      : cleanedRol;
                return parsedRol === 'VERANTWOORDELIJKE';
              }
              return false;
            } catch (e) {
              console.error('Error parsing rol:', e);
              return false;
            }
          })
          : [];

        setVerantwoordelijken(filteredVerantwoordelijken);
        setAvailableMachines(Array.isArray(machinesResponse.items) ? machinesResponse.items : []);
        setSelectedMachines([]);
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const moveToSelected = () => {
    const selected = document.querySelector('#availableMachines').selectedOptions;
    if (selected.length > 0) {
      const selectedIds = Array.from(selected).map((option) => parseInt(option.value));
      const machinesToMove = availableMachines.filter((m) => selectedIds.includes(m.id));

      setSelectedMachines([...selectedMachines, ...machinesToMove]);
      setAvailableMachines(availableMachines.filter((m) => !selectedIds.includes(m.id)));
    }
  };

  const moveToAvailable = () => {
    const selected = document.querySelector('#selectedMachines').selectedOptions;
    if (selected.length > 0) {
      const selectedIds = Array.from(selected).map((option) => parseInt(option.value));
      const machinesToMove = selectedMachines.filter((m) => selectedIds.includes(m.id));

      setAvailableMachines([...availableMachines, ...machinesToMove]);
      setSelectedMachines(selectedMachines.filter((m) => !selectedIds.includes(m.id)));
    }
  };

  const moveAllToSelected = () => {
    setSelectedMachines([...selectedMachines, ...availableMachines]);
    setAvailableMachines([]);
  };

  const moveAllToAvailable = () => {
    setAvailableMachines([...availableMachines, ...selectedMachines]);
    setSelectedMachines([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSite({
        ...formData,
        machines_ids: selectedMachines.map((m) => m.id),
      });

      setSuccessMessage('Site succesvol toegevoegd!');

      setTimeout(() => {
        navigate('/sites');
      }, 2000);
    } catch (err) {
      console.error('Creation failed:', err);
      setError('Er is een fout opgetreden bij het toevoegen van de site.');
    }
  };

  const pageTitle = 'Nieuwe site toevoegen';

  return (
    <AsyncData loading={loading} error={error}>
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-6">
          <a href="/sites" className="inline-flex items-center" data-cy="back-button">
            ← {pageTitle}
          </a>
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" data-cy="success-message">
            {successMessage}
          </div>
        )}

        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-xl font-semibold mb-6">Informatie</h2>

          <form onSubmit={handleSubmit} data-cy="site-form">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-gray-700 mb-2">Naam</label>
                <input
                  type="text"
                  name="naam"
                  value={formData.naam}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="naam van de site"
                  required
                  data-cy="site-name"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Verantwoordelijke</label>
                <select
                  name="verantwoordelijke_id"
                  value={formData.verantwoordelijke_id}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                  data-cy="verantwoordelijke-select"
                >
                  <option value="">Selecteer verantwoordelijke</option>
                  {verantwoordelijken.map((verantwoordelijke) => (
                    <option key={verantwoordelijke.id} value={verantwoordelijke.id}>
                      {verantwoordelijke.naam || `User ${verantwoordelijke.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Status van site</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  data-cy="status-select"
                >
                  <option value="ACTIEF">Actief</option>
                  <option value="INACTIEF">Inactief</option>
                </select>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Machines</h2>
            <div className="flex space-x-4">
              <select id="availableMachines" multiple className="w-full h-48 border rounded p-2" size="8" data-cy="available-machines">
                {availableMachines.map((machine) => (
                  <option key={machine.id} value={machine.id}>
                    {formatMachineDisplay(machine)}
                  </option>
                ))}
              </select>

              <div className="flex flex-col space-y-2">
                <button type="button" onClick={moveToSelected} data-cy="move-to-selected">&gt;</button>
                <button type="button" onClick={moveAllToSelected} data-cy="move-all-to-selected">&gt;&gt;</button>
                <button type="button" onClick={moveToAvailable} data-cy="move-to-available">&lt;</button>
                <button type="button" onClick={moveAllToAvailable} data-cy="move-all-to-available">&lt;&lt;</button>
              </div>

              <select id="selectedMachines" multiple className="w-full h-48 border rounded p-2" size="8" data-cy="selected-machines">
                {selectedMachines.map((machine) => (
                  <option key={machine.id} value={machine.id}>
                    {formatMachineDisplay(machine)}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="w-full bg-red-500 text-white px-4 py-2 rounded mt-8" data-cy="submit-button">
              Opslaan
            </button>
          </form>
        </div>
      </div>
    </AsyncData>
  );
}
