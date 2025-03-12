import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAll, updateSite } from '../../api';
import AsyncData from '../../components/AsyncData';
import { FaArrowLeft } from 'react-icons/fa';
import { 
  MdKeyboardArrowDown, 
  MdKeyboardArrowRight, 
  MdKeyboardDoubleArrowDown, 
  MdKeyboardDoubleArrowRight, 
  MdKeyboardArrowUp, 
  MdKeyboardArrowLeft,
  MdKeyboardDoubleArrowUp, 
  MdKeyboardDoubleArrowLeft } from 'react-icons/md';

export default function SiteBeheren() {
  const { id } = useParams();
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
  const [locatie, setLocatie] = useState('');
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
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const siteData = await getAll(`sites/${id}`);
        console.log('Fetched Site Data:', siteData);
        
        setFormData({
          naam: siteData.naam || '',
          verantwoordelijke_id: siteData.verantwoordelijke?.id || '',
          status: siteData.status || 'ACTIEF',
          machines_ids: siteData.machines?.map((m) => m.id) || [],
        });
  
        const [verantwoordelijkenData, machinesResponse] = await Promise.all([
          getAll('users'),
          getAll('machines'),
        ]);
  
        // Filter users to only include those with the role 'VERANTWOORDELIJKE'
        const filteredVerantwoordelijken = Array.isArray(verantwoordelijkenData.items)
          ? verantwoordelijkenData.items.filter((user) => {
            // Handle the double-quoted JSON string format of the rol property
            try {
              // First, try to parse it as JSON if it's a string
              if (typeof user.rol === 'string') {
                // Remove any extra escape characters that might be in the console output
                const cleanedRol = user.rol.replace(/\\/g, '');
                // Try to parse as JSON or just use the string directly
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
          : (Array.isArray(machinesResponse) ? machinesResponse : []);
        
        if (siteData && siteData.machines) {
          const siteIds = Array.isArray(siteData.machines) 
            ? siteData.machines.map((m) => m.id) 
            : [];
            
          const selected = machinesData.filter((machine) => siteIds.includes(machine.id));
          const available = machinesData.filter((machine) => !siteIds.includes(machine.id));
  
          setAvailableMachines(available);
          setSelectedMachines(selected);
        } else {
          setAvailableMachines(machinesData);
          setSelectedMachines([]);
        }
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
  }, [id]);
  
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
      // Update site and pass the selected machine IDs
      await updateSite(id, { 
        ...formData, 
        machines_ids: selectedMachines.map((m) => m.id),
      });
  
      // Show success message
      setSuccessMessage('Site succesvol bijgewerkt!');
  
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/sites');
      }, 2000);
    } catch (err) {
      console.error('Update failed:', err);
      setError('Er is een fout opgetreden bij het bijwerken van de site.');
    }
  };

  const handleOnClickBack = () => {
    navigate('/sites');
  };
  const isNewSite = id === 'new';
  const pageTitle = isNewSite ? 'Nieuwe site aanmaken' : `${formData.naam} wijzigen`;

  return (
    <AsyncData loading={loading} error={error}>
      <div className="p-2 md:p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-6 md:mb-12">
          <button 
            className="text-gray-700 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 self-start"
            onClick={handleOnClickBack}
            aria-label="Go back"
          >
            <FaArrowLeft size={20} className="md:text-2xl" />
          </button>
            
          <h1 className="text-2xl md:text-4xl font-semibold"> 
            Site | {pageTitle}
          </h1>
        </div>
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        
        <div className="bg-white p-3 md:p-6 border rounded">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">Informatie</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
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
            
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">Machines</h2>
            
            {/* Responsive layout for machines selection */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <div className="w-full md:w-5/12">
                <h3 className="text-sm mb-1">Beschikbare machines</h3>
                <p className="text-xs text-gray-500 mb-2">(selecteer de rij(en) die aan deze site gelinkt worden)</p>
                <select
                  id="availableMachines"
                  multiple
                  className="w-full h-36 md:h-48 border rounded p-2"
                  size="8"
                >
                  {availableMachines.map((machine) => (
                    <option key={machine.id} value={machine.id}>
                      {formatMachineDisplay(machine)}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Control buttons - horizontal on mobile, vertical on desktop */}
              <div className="w-full md:w-2/12 flex flex-row md:flex-col justify-center items-center
               space-x-2 md:space-x-0 md:space-y-2">
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded w-14 md:w-16 text-center
                   flex justify-center items-center"
                  onClick={moveToSelected}
                >
                  <span className="block md:hidden">
                    <MdKeyboardArrowDown size={18} />
                  </span>
                  <span className="hidden md:block">
                    <MdKeyboardArrowRight size={18} />
                  </span>
                </button>
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-1 
                  rounded w-14 md:w-16 text-center flex 
                  justify-center items-center"
                  onClick={moveAllToSelected}
                >
                  <span className="block md:hidden">
                    <MdKeyboardDoubleArrowDown size={18} />
                  </span>
                  <span className="hidden md:block">
                    <MdKeyboardDoubleArrowRight size={18} />
                  </span>
                </button>
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded w-14 md:w-16
                   text-center flex justify-center items-center"
                  onClick={moveToAvailable}
                >
                  <span className="block md:hidden">
                    <MdKeyboardArrowUp size={18} />
                  </span>
                  <span className="hidden md:block">
                    <MdKeyboardArrowLeft size={18} />
                  </span>
                </button>
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded w-14 md:w-16 
                  text-center flex justify-center items-center"
                  onClick={moveAllToAvailable}
                >
                  <span className="block md:hidden">
                    <MdKeyboardDoubleArrowUp size={18} />
                  </span>
                  <span className="hidden md:block">
                    <MdKeyboardDoubleArrowLeft size={18} />
                  </span>
                </button>
              </div>
              
              <div className="w-full md:w-5/12">
                <h3 className="text-sm mb-1">Geselecteerde machines</h3>
                <select
                  id="selectedMachines"
                  multiple
                  className="w-full h-36 md:h-48 border rounded p-2"
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
            
            <div className="mt-6 md:mt-8">
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