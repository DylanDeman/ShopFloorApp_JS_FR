import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getById, updateMachine, getAll } from '../../api';
import AsyncData from '../../components/AsyncData';
import PageHeader from '../../components/genericComponents/PageHeader';
import SuccessMessage from '../../components/sites/SuccesMessage';

export default function EditMachineForm() {
  const { id } = useParams(); // Get machine ID from URL
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    code: '',
    locatie: '',
    status: 'DRAAIT',
    productie_status: 'GEZOND',
    technieker_gebruiker_id: '',
    product_id: '',
    product_informatie: '',
    //site_id: '',
  });

  const [techniekers, setTechniekers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        
        const machineData = await getById('machines', id);
        
        // Set form data
        setFormData({
          code: machineData.code || '',
          locatie: machineData.locatie || '',
          status: machineData.status || 'DRAAIT',
          productie_status: machineData.productie_status || 'GEZOND',
          technieker_gebruiker_id: machineData.technieker_gebruiker_id || '',
          product_id: machineData.product_id || '',
          product_informatie: machineData.product_informatie || '',
          site_id: machineData.site_id || '',
        });

        // Fetch techniekers and products
        const [techniekersData, productsData] = await Promise.all([
          getAll('users'),
          getAll('producten'),
        ]);

        // Filter techniekers
        const filteredTechniekers = techniekersData.items.filter((user) => user.rol === 'TECHNIEKER');
        setTechniekers(filteredTechniekers);
        
        // Set products
        setProducts(productsData.items);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Er is een fout opgetreden');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Exclude site_id from the update request
    const { site_id, ...updatedFormData } = formData;
    
    try {
      await updateMachine(id, updatedFormData);
      setSuccessMessage('Machine succesvol bijgewerkt!');
      
      // Store the previous page in the state and navigate back to it
      setTimeout(() => {
        navigate(-1); // Go back to the previous page
      }, 2000);
    } catch (err) {
      console.error('Update failed:', err);
      setError('Er is een fout opgetreden bij het bijwerken van de machine.');
    }
  };
  
  const handleOnClickBack = () => {
    navigate(-1);
  };

  return (
    <AsyncData loading={loading} error={error}>
      <div className="p-2 md:p-4">
        <PageHeader title="Machine wijzigen" onBackClick={handleOnClickBack} />
        
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
              <label htmlFor="technieker_gebruiker_id" className="block text-sm font-medium text-gray-700">Technieker

              </label>
              <select 
                name="technieker_gebruiker_id" 
                value={formData.technieker_gebruiker_id} 
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
              <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">Product</label>
              <select 
                name="product_id" 
                value={formData.product_id} 
                onChange={handleChange} 
                className="mt-1 p-2 border rounded w-full" 
                required
              >
                <option value="">Selecteer een product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.naam}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="product_informatie" className="block text-sm font-medium text-gray-700">Product Informatie
                
              </label>
              <textarea 
                name="product_informatie" 
                value={formData.product_informatie} 
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