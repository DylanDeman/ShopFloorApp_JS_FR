import Information from '../../components/Information';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { getById } from '../../api/index';
import AsyncData from '../../components/AsyncData';
import { FaArrowLeft } from 'react-icons/fa';

const MachineDetail = () => {
  const navigate = useNavigate();
  
  const handleOnClickBack = () => {
    navigate('/sites');
  };

  const { id } = useParams();
  const idAsNumber = Number(id);
    
  const {
    data: machine = [],
    error: machineError,
    isLoading: MachineLoading,
  } = useSWR(id ? `machines/${idAsNumber}` : null, getById);
  
  const siteData = [
    { label: 'Naam site', value: 'Actual name site' },
    { label: 'Verantwoordelijke site', value: 'Actual name verantwoordelijke' },
    { label: 'Locatie', value: 'Actual name locatie' },
    { label: 'Technieker', value: 'Actual name technieker' },
  ];

  return (
    <>
      <AsyncData error={machineError} loading={MachineLoading}>
        <div className="flex justify-between items-center mb-6 mt-10">
          <div className="flex items-center gap-4">
            <button 
              className="text-gray-700 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
              onClick={handleOnClickBack}
              aria-label="Go back"
            >
              <FaArrowLeft size={24} />
            </button>
    
            <h1 className="text-4xl font-semibold"> 
              Machine | {machine.code}
            </h1>
          </div>
        </div>

        <Information 
          info={'Hieronder vindt u alle informatie over de machine met code: ' + machine.code}
          icon={IoInformationCircleOutline}
        />

        <div className="border p-4 rounded-lg mt-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h2 className="text-3xl font-semibold mb-2">Machine informatie</h2>
              <span className="text-l font-bold">Uptime: </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Status: {machine.status}</h2>
              <span className="text-2xl font-medium">Productiestatus: {machine.productieStatus}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12">
            {siteData.map((site, index) => (
              <div key={index} className="flex flex-col mb-4">
                <span className="text-lg font-medium">{site.label}</span>
                <span className="text-lg bg-gray-200 pl-5 pr-3 py-1 rounded">
                  {site.value}
                </span>
              </div>
            ))}
          </div>

        </div>
        
      </AsyncData>
    </>
  );
};

export default MachineDetail;