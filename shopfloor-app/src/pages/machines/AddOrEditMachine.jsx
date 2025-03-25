import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import AsyncData from '../../components/AsyncData';
import PageHeader from '../../components/genericComponents/PageHeader';
import SuccessMessage from '../../components/genericComponents/SuccesMessage';
import { getAll, getById, updateMachine, createMachine } from '../../api';
import { useAuth } from '../../contexts/auth';

export default function AddOrEditMachine() {
  const { role } = useAuth();
  const navigate = useNavigate();
  if(role !== 'VERANTWOORDELIJKE') {
    navigate('/not-found');
  }
  
  const { id } = useParams();
  const machineId = id;
  const isNewMachine = !machineId || machineId === 'new';
  
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  const [isFormDataInitialized, setIsFormDataInitialized] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    status: 'DRAAIT',
    productie_status: 'GEZOND',
    locatie: '',
    technieker_id: '',
    site_id: '',
    product_naam: '',
    product_informatie: '',
    limiet_voor_onderhoud: 100,
  });

  // Fetch machine data if editing an existing machine
  const { data: machineData, error: machineError } = useSWR(
    !isNewMachine ? `/machines/${machineId}` : null,
    () => getById(`/machines/${machineId}`),
  );

  // Fetch techniekers using SWR
  const { data: techniekersData, error: techniekersError } = useSWR('/users', getAll);
  const techniekers = techniekersData?.items.filter((user) => user.rol === 'TECHNIEKER') || [];

  // Fetch sites using SWR
  const { data: sitesData, error: sitesError } = useSWR('/sites', getAll);
  const sites = sitesData?.items || [];

  // Set form data when machine data is loaded - ONLY ONCE
  useEffect(() => {
    if (machineData && !isFormDataInitialized) {
      setFormData({
        code: machineData.code || '',
        locatie: machineData.locatie || '',
        status: machineData.status || 'DRAAIT',
        productie_status: machineData.productie_status || 'GEZOND',
        technieker_id: machineData.technieker?.id || '',
        site_id: machineData.site?.id || '',
        product_naam: machineData.product_naam || '',
        product_informatie: machineData.product_informatie || '',
        limiet_voor_onderhoud: machineData.limiet_voor_onderhoud || 150,
      });
      setIsFormDataInitialized(true);
    }
  }, [machineData, isFormDataInitialized]);

  // Determine loading and error states
  const isLoading = (!isNewMachine && !machineData && !machineError) || 
                   (!techniekersData && !techniekersError) || 
                   (!sitesData && !sitesError);
  const fetchError = machineError || techniekersError || sitesError || error;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const machineUpdateData = {
        code: formData.code,
        status: formData.status,
        productie_status: formData.productie_status,
        locatie: formData.locatie,
        limiet_voor_onderhoud: formData.limiet_voor_onderhoud,
        technieker_id: formData.technieker_id,
        site_id: formData.site_id,
        product_naam: formData.product_naam,
        product_informatie: formData.product_informatie,
      };
      
      if (isNewMachine) {
        await createMachine(machineUpdateData);
        setSuccessMessage('Machine succesvol toegevoegd!');
      } else {
        await updateMachine(machineId, machineUpdateData);
        setSuccessMessage('Machine succesvol bijgewerkt!');
      }
      
    } catch (err) {
      console.error(`${isNewMachine ? 'Creation' : 'Update'} failed:`, err);
      setError(`Er is een fout opgetreden bij het ${isNewMachine ? 'toevoegen' : 'bijwerken'} van de machine.`);
    }
  };
  
  const handleOnClickBack = () => {
    navigate(-1);
  };

  const pageTitle = isNewMachine ? 'Nieuwe machine toevoegen' : `Machine "${formData.code}" wijzigen`;

  return (
    <AsyncData loading={isLoading} error={fetchError}>
      <div className="p-2 md:p-4">
        <PageHeader title={pageTitle} onBackClick={handleOnClickBack} />
        
        {successMessage && <SuccessMessage message={successMessage} />}
        
        <div className="bg-white p-3 md:p-6 border rounded">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">Machine Informatie</h2>
          
          <form onSubmit={handleSubmit} data-cy="machine-form">
            <div className="mb-4">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">Machine Code</label>
              <input 
                type="text" 
                name="code" 
                value={formData.code} 
                onChange={handleChange} 
                className="mt-1 p-2 border rounded w-full" 
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="locatie" className="block text-sm font-medium text-gray-700">Locatie</label>
              <input 
                type="text" 
                name="locatie" 
                value={formData.locatie} 
                onChange={handleChange} 
                className="mt-1 p-2 border rounded w-full" 
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="site_id" className="block text-sm font-medium text-gray-700">Site</label>
              <select 
                name="site_id" 
                value={formData.site_id} 
                onChange={handleChange} 
                className="mt-1 p-2 border rounded w-full" 
                required
              >
                <option value="">Selecteer een site</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.naam}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="technieker_id" className="block text-sm font-medium text-gray-700">Technieker</label>
              <select 
                name="technieker_id" 
                value={formData.technieker_id} 
                onChange={handleChange} 
                className="mt-1 p-2 border rounded w-full" 
                required
              >
                <option value="">Selecteer een technieker</option>
                {techniekers.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.naam} {tech.voornaam}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="product_naam" className="block text-sm font-medium text-gray-700">Product Naam</label>
              <input 
                type="text" 
                name="product_naam" 
                value={formData.product_naam} 
                onChange={handleChange} 
                className="mt-1 p-2 border rounded w-full" 
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="product_informatie" className="block text-sm font-medium text-gray-700">
                Product Informatie
              </label>
              <textarea 
                name="product_informatie" 
                value={formData.product_informatie} 
                onChange={handleChange} 
                className="mt-1 p-2 border rounded w-full" 
                rows="3"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="limiet_voor_onderhoud" className="block text-sm font-medium text-gray-700">
                Aantal producten te produceren voor onderhoud
              </label>
              <input 
                type="number" 
                name="limiet_voor_onderhoud" 
                value={formData.limiet_voor_onderhoud} 
                onChange={handleChange} 
                className="mt-1 p-2 border rounded w-full" 
                required
              />
            </div>

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