import useSWR from 'swr';
import { getAll } from '../../api';
import AsyncData from '../../components/AsyncData';
import SiteList from './SiteList';
import Information from '../../components/Information';
import { IoMdAddCircleOutline } from 'react-icons/io';

const Sites = () => {
  const { data: allSitesData, loading, error } = useSWR('sites', getAll);
  
  const handleAddSite = () => {
    window.alert('Nieuwe site toevoegen');
    // TODO navigeren naar ander scherm!!!
  };
  
  return (
    <AsyncData loading={loading} error={error}>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold mb-6 mt-10"> 
          Overzicht sites 
        </h1>
        
        <button 
          className="bg-red-500 hover:cursor-pointer hover:bg-red-700 
          text-white font-bold py-2 px-4 
          rounded flex items-center gap-2"
          onClick={() => handleAddSite()}
        >
          <IoMdAddCircleOutline />
          Site toevoegen
        </button>
      </div>

      <Information 
        info="Hieronder vindt u een overzicht van alle sites. 
        Klik op een site om een site te raadplegen en 
        zijn machines te bekijken."
      />
      
      <SiteList
        allSitesData={allSitesData}
        loading={loading} 
        error={error} 
      />
    </AsyncData>
  );
};

export default Sites;