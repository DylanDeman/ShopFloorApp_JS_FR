import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAll, createMachine } from '../../api';
import AsyncData from '../../components/AsyncData';
import { useParams } from 'react-router-dom';
import PageHeader from '../../components/genericComponents/PageHeader';
import SuccessMessage from '../../components/sites/SuccesMessage';

export default function MachineForm() {
  const { id, machineId } = useParams();
  const navigate = useNavigate();
  const isNewMachine = !machineId || machineId === 'new';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    locatie: '',
    status: 'DRAAIT',
    productie_status: 'GEZOND',
    technieker_id: '',
    product_id: '',
    product_informatie: '',
    site_id: id,
  });

  const [techniekers, setTechniekers] = useState([]);
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [techniekersData, productsData] = await Promise.all([
          getAll('users'),
          getAll('producten'),
        ]);
  
        // Filter and set techniekers
        const filteredTechniekers = techniekersData.items.filter((user) => user.rol === 'TECHNIEKER');
        setTechniekers(filteredTechniekers);
  
        // Set products
        setProducts(productsData.items);
      } catch (err) {
        console.error('Error in fetchData:', err);
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
    try {
      const machineData = { ...formData };

      await createMachine(machineData);
      setSuccessMessage('Machine succesvol toegevoegd!');
      
      setTimeout(() => {
        navigate(-1); // Redirect to machines list after 2 seconds
      }, 2000);
    } catch (err) {
      console.error('Creation failed:', err);
      setError('Er is een fout opgetreden bij het toevoegen van de machine.');
    }
  };

  const handleOnClickBack = () => {
    navigate(-1);
  };

  return (
    <AsyncData loading={loading} error={error}>
      <div className="p-2 md:p-4">
        <PageHeader 
          title={isNewMachine ? 'Nieuwe machine toevoegen' : 'Machine wijzigen'}
          onBackClick={handleOnClickBack}
        />
        
        {successMessage && <SuccessMessage message={successMessage} />}
        
        <div className="bg-white p-3 md:p-6 border rounded">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">Machine Informatie</h2>
          
          <form onSubmit={handleSubmit} data-cy="machine-form">
            {/* Machine Form Inputs */}
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
