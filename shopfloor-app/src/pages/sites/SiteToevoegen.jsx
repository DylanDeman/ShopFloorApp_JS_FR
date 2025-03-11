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

  // Format machine display text based on the actual machine object structure
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
  
        // Filter users to only include those with the role 'MANAGER'
        const filteredVerantwoordelijken = Array.isArray(verantwoordelijkenData.items)
          ? verantwoordelijkenData.items.filter(user => {
            // Handle the double-quoted JSON string format of the rol property
            try {
              // First, try to parse it as JSON if it's a string
              if (typeof user.rol === 'string') {
                // Remove any extra escape characters that might be in the console output
               const cleanedRol = user.rol.replace(/\\/g, '');                  // Try to parse as JSON or just use the string directly
                const parsedRol = cleanedRol.startsWith('"') && cleanedRol.endsWith('"')
                  ? cleanedRol.slice(1, -1) // Remove outer quotes
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
        
        console.log('Filtered users:', filteredVerantwoordelijken);
        setVerantwoordelijken(filteredVerantwoordelijken);
  
        const machinesData = Array.isArray(machinesResponse.items)
          ? machinesResponse.items
          : [];
  
        setAvailableMachines(machinesData);
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

  // Move machine from available to selected
  const moveToSelected = () => {
    const selected = document.querySelector('#availableMachines').selectedOptions;
    if (selected.length > 0) {
      const selectedIds = Array.from(selected).map((option) => parseInt(option.value));
      const machinesToMove = availableMachines.filter((m) => selectedIds.includes(m.id));

      setSelectedMachines([...selectedMachines, ...machinesToMove]);
      setAvailableMachines(availableMachines.filter((m) => !selectedIds.includes(m.id)));
    }
  };

  // Move machine from selected to available
  const moveToAvailable = () => {
    const selected = document.querySelector('#selectedMachines').selectedOptions;
    if (selected.length > 0) {
      const selectedIds = Array.from(selected).map((option) => parseInt(option.value));
      const machinesToMove = selectedMachines.filter((m) => selectedIds.includes(m.id));

      setAvailableMachines([...availableMachines, ...machinesToMove]);
      setSelectedMachines(selectedMachines.filter((m) => !selectedIds.includes(m.id)));
    }
  };

  // Move all machines from available to selected
  const moveAllToSelected = () => {
    setSelectedMachines([...selectedMachines, ...availableMachines]);
    setAvailableMachines([]);
  };

  // Move all machines from selected to available
  const moveAllToAvailable = () => {
    setAvailableMachines([...availableMachines, ...selectedMachines]);
    setSelectedMachines([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create site with the selected machine IDs
      await createSite({
        ...formData,
        machines_ids: selectedMachines.map((m) => m.id),
      });

      // Show success message
      setSuccessMessage('Site succesvol toegevoegd!');

      // Redirect after 2 seconds
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
          <a href="/sites" className="inline-flex items-center">
            ← {pageTitle}
          </a>
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-xl font-semibold mb-6">Informatie</h2>

          <form onSubmit={handleSubmit}>
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
                >
                  <option value="">Selecteer verantwoordelijke</option>
                  {verantwoordelijken.map((verantwoordelijke) => (
                    <option key={verantwoordelijke.id} value={verantwoordelijke.id}>
                      {verantwoordelijke.naam || verantwoordelijke.name || `User ${verantwoordelijke.id}`}
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
                >
                  <option value="ACTIEF">Actief</option>
                  <option value="INACTIEF">Inactief</option>
                </select>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Machines</h2>
            <div className="flex space-x-4">
              <div className="w-5/12">
                <h3 className="text-sm mb-1">Beschikbare machines</h3>
                <p className="text-xs text-gray-500 mb-2">(selecteer de rij(en) die aan deze site gelinkt worden)</p>
                <select
                  id="availableMachines"
                  multiple
                  className="w-full h-48 border rounded p-2"
                  size="8"
                >
                  {availableMachines.map((machine) => (
                    <option key={machine.id} value={machine.id}>
                      {formatMachineDisplay(machine)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-2/12 flex flex-col justify-center items-center space-y-2">
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded w-16 text-center"
                  onClick={moveToSelected}
                >
                  &gt;
                </button>
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded w-16 text-center"
                  onClick={moveAllToSelected}
                >
                  &gt;&gt;
                </button>
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded w-16 text-center"
                  onClick={moveToAvailable}
                >
                  &lt;
                </button>
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded w-16 text-center"
                  onClick={moveAllToAvailable}
                >
                  &lt;&lt;
                </button>
              </div>

              <div className="w-5/12">
                <h3 className="text-sm mb-1">Geselecteerde machines</h3>
                <select
                  id="selectedMachines"
                  multiple
                  className="w-full h-48 border rounded p-2"
                  size="8"
                >
                  {selectedMachines.map((machine) => (
                    <option key={machine.id} value={machine.id}>
                      {formatMachineDisplay(machine)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8">
              <button 
                type="submit" 
                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Opslaan
              </button>
            </div>
          </form>
        </div>
      </div>
    </AsyncData>
  );
}
