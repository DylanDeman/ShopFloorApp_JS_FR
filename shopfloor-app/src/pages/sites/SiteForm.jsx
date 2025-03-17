import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAll, createSite, updateSite } from '../../api';
import AsyncData from '../../components/AsyncData';
import { useParams } from 'react-router-dom';
import PageHeader from '../../components/genericComponents/PageHeader';
import SiteInfoForm from '../../components/sites/SiteInfoForm';
import MachineSelector from '../../components/sites/MachineSelector';
import SuccessMessage from '../../components/sites/SuccesMessage';

export default function SiteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewSite = !id || id === 'new';
  
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

  useEffect(() => {
    async function fetchData() {
      try {
        const [verantwoordelijkenData, machinesResponse] = await Promise.all([
          getAll('users'),
          getAll('machines'),
        ]);

        const filteredVerantwoordelijken = filterVerantwoordelijken(verantwoordelijkenData.items);
        setVerantwoordelijken(filteredVerantwoordelijken);
        
        const machinesData = Array.isArray(machinesResponse.items) 
          ? machinesResponse.items 
          : (Array.isArray(machinesResponse) ? machinesResponse : []);
        
        if (!isNewSite) {
          const siteData = await getAll(`sites/${id}`);
          
          setFormData({
            naam: siteData.naam || '',
            verantwoordelijke_id: siteData.verantwoordelijke?.id || '',
            status: siteData.status || 'ACTIEF',
            machines_ids: siteData.machines?.map((m) => m.id) || [],
          });

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
  }, [id, isNewSite]);
  
  const filterVerantwoordelijken = (users) => {
    return Array.isArray(users)
      ? users.filter((user) => {
        try {
          if (typeof user.rol === 'string') {
            const cleanedRol = user.rol.replace(/\\/g, '');
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
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMachineMove = {
    moveToSelected: (selectedIds) => {
      const machinesToMove = availableMachines.filter((m) => selectedIds.includes(m.id));
      setSelectedMachines([...selectedMachines, ...machinesToMove]);
      setAvailableMachines(availableMachines.filter((m) => !selectedIds.includes(m.id)));
    },
    moveToAvailable: (selectedIds) => {
      const machinesToMove = selectedMachines.filter((m) => selectedIds.includes(m.id));
      setAvailableMachines([...availableMachines, ...machinesToMove]);
      setSelectedMachines(selectedMachines.filter((m) => !selectedIds.includes(m.id)));
    },
    moveAllToSelected: () => {
      setSelectedMachines([...selectedMachines, ...availableMachines]);
      setAvailableMachines([]);
    },
    moveAllToAvailable: () => {
      setAvailableMachines([...availableMachines, ...selectedMachines]);
      setSelectedMachines([]);
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const siteData = {
        ...formData,
        machines_ids: selectedMachines.map((m) => m.id),
      };

      if (isNewSite) {
        await createSite(siteData);
        setSuccessMessage('Site succesvol toegevoegd!');
      } else {
        await updateSite(id, siteData);
        setSuccessMessage('Site succesvol bijgewerkt!');
      }
      
      setTimeout(() => {
        navigate('/sites');
      }, 2000);
    } catch (err) {
      console.error(`${isNewSite ? 'Creation' : 'Update'} failed:`, err);
      setError(`Er is een fout opgetreden bij het ${isNewSite ? 'toevoegen' : 'bijwerken'} van de site.`);
    }
  };

  const handleOnClickBack = () => {
    navigate('/sites');
  };
  
  const pageTitle = isNewSite ? 'Nieuwe site toevoegen' : `${formData.naam} wijzigen`;

  return (
    <AsyncData loading={loading} error={error}>
      <div className="p-2 md:p-4">
        <PageHeader 
          title={isNewSite ? pageTitle : `Site | ${pageTitle}`}
          onBackClick={handleOnClickBack}
        />
        
        {successMessage && <SuccessMessage message={successMessage} />}
        
        <div className="bg-white p-3 md:p-6 border rounded">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">Informatie</h2>
          
          <form onSubmit={handleSubmit} data-cy="site-form">
            <SiteInfoForm 
              formData={formData}
              verantwoordelijken={verantwoordelijken}
              onChange={handleChange}
            />
            
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">Machines</h2>
            
            <MachineSelector
              availableMachines={availableMachines}
              selectedMachines={selectedMachines}
              onMachineMove={handleMachineMove}
            />
            
            <div className="mt-6 md:mt-8">
              <button 
                type="submit" 
                className="w-full bg-[rgb(171,155,203)] hover:bg-[rgb(151,135,183)] text-white px-4 py-2 rounded"
            
                data-cy="submit-button"
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