import SiteList from './SiteList';
import Information from '../../components/Information';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
const Sites = () => {

  const navigate = useNavigate();
  
  const handleAddSite = () => {
    navigate('/sites/create');
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6 mt-10">
        <h1 className="text-4xl font-semibold"> 
          Overzicht sites 
        </h1>
        <button 
          className=" hover:cursor-pointer bg-[rgb(171,155,203)] hover:bg-[rgb(151,135,183)] 
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
        Klik op een site om de details van de site te bekijken!"
        icon={IoInformationCircleOutline}
      />
      
      {/* Lijst met alle sites*/}
      <SiteList/>
    </>
  );
};

export default Sites;