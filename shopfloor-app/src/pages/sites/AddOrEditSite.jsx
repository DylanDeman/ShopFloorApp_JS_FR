import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { createSite, getAll, getById, updateSite } from '../../api';
import AsyncData from '../../components/AsyncData';
import PageHeader from '../../components/genericComponents/PageHeader';
import SiteInfoForm from '../../components/Sites/siteEditOrAddComponents/SiteInfoForm';
import SuccessMessage from '../../components/genericComponents/SuccesMessage';
import { useAuth } from '../../contexts/auth';

export default function AddOrEditSite() {
  const { role } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewSite = !id || id === 'new';
  
  if (!role !== 'MANAGER') {
    navigate('/not-found');
  }

  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    naam: '',
    verantwoordelijke_id: '',
    status: 'ACTIEF',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [isFormDataInitialized, setIsFormDataInitialized] = useState(false);

  const filterVerantwoordelijken = (users) => {
    return Array.isArray(users)
      ? users.filter((user) => {
        try {
          if (typeof user.rol === 'string') {
            const cleanedRol = user.rol.replace(/\\/g, '');
            const parsedRol = cleanedRol.startsWith('"') && cleanedRol.endsWith('"')
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
  };

  // Fetch users data with useSWR
  const { 
    data: usersData, 
    error: usersError, 
    loading: usersLoading, 
  } = useSWR('/users', getAll);
  
  // Fetch site data if editing an existing site
  const { 
    data: siteData, 
    error: siteError, 
    loading: siteLoading, 
  } = useSWR( !isNewSite ? `/sites/${id}` : null, getById);

  // Process users data to filter verantwoordelijken
  const verantwoordelijken = usersData ? filterVerantwoordelijken(usersData.items) : [];
  
  // Set form data when site data is loaded - ONLY ONCE
  useEffect(() => {
    if (siteData && !isFormDataInitialized) {
      setFormData({
        naam: siteData.naam || '',
        verantwoordelijke_id: siteData.verantwoordelijke?.id || '',
        status: siteData.status || 'ACTIEF',
      });
      setIsFormDataInitialized(true);
    }
  }, [siteData, isFormDataInitialized]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNewSite) {
        await createSite(formData);
        setSuccessMessage('Site succesvol toegevoegd!');
      } else {
        await updateSite(id, formData);
        setSuccessMessage('Site succesvol bijgewerkt!');
      }
    } catch (err) {
      console.error(`${isNewSite ? 'Creation' : 'Update'} failed:`, err);
      setError(`Er is een fout opgetreden bij het ${isNewSite ? 'toevoegen' : 'bijwerken'} van de site.`);
    }
  };

  const handleOnClickBack = () => {
    navigate('/sites');
  };
  
  const pageTitle = isNewSite ? 'Nieuwe site toevoegen' : `${formData.naam} wijzigen`;
  
  const isLoading = (!isNewSite && !siteData && !siteError) 
  || (!usersData && !usersError) || siteLoading || usersLoading;
  const fetchError = usersError || siteError || error;

  return (
    <AsyncData loading={isLoading} error={fetchError}>
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
