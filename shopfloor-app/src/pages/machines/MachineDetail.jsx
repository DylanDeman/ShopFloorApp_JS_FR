import Information from '../../components/Information';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR, {mutate} from 'swr';
import { getById } from '../../api/index';
import AsyncData from '../../components/AsyncData';
import { FaArrowLeft } from 'react-icons/fa';
import MachineInfoHeader from '../../components/machines/MachineInfoHeader';
import useSWRMutation from 'swr/mutation';
import MaintenanceTable from '../../components/machines/MaintenanceTableMachine';
import { save } from '../../api/index';

const MachineDetail = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const idAsNumber = Number(id);
    
  const {
    data: machine = [],
    error: machineError,
    isLoading: MachineLoading,
  } = useSWR(id ? `machines/${idAsNumber}` : null, getById);
  
  const {
    trigger: changeMachineStatus,
    isMutating,
  } = useSWRMutation('machines', save, {method: 'PUT'});

  const handleOnClickBack = () => {
    navigate(`../../sites/${machine?.site.id}`);
  };

  const toggleMachineStatus = async () => {
    let status;
    if(machine.status === 'DRAAIT'){
      status = 'MANUEEL_GESTOPT';
    } else {
      status = 'DRAAIT';
    }
    await changeMachineStatus(
      {
        id: machine.id,
        site_id: machine.site.id, 
        product_id: machine.product_id, 
        technieker_gebruiker_id: machine.technieker.id, 
        code: machine.code, 
        locatie: machine.locatie,
        status: status,
        productie_status: machine.productie_status,
      },
    );
    // machine status gets refetched so the displayed status is up to date
    mutate(`machines/${idAsNumber}`);
    // notifications also get updated
    mutate('notificaties');
  };

  const siteData = [
    { 
      label: 'Naam site', 
      value: machine.site?.naam, 
    },
    { 
      label: 'Verantwoordelijke site', 
      value: `${machine.site?.verantwoordelijke?.naam} ${machine.site?.verantwoordelijke?.voornaam}`,
    },
    { 
      label: 'Locatie', 
      value: machine.locatie, 
    },
    { 
      label: 'Technieker', 
      value: `${machine.technieker?.naam} ${machine.technieker?.voornaam}`, 
    },
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

        <div data-cy="machine_details" className="border p-4 rounded-lg mt-4 w-full">
          {/* Algemene machine informatie */}
          <MachineInfoHeader machine={machine} />
        
          {/* Machine data grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-6">

            {/* Site data grid */}
            {siteData.map((site, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-lg font-medium mb-1">{site.label}</span>
                <span className="text-lg bg-gray-200 pl-5 pr-3 py-1 rounded">
                  {site.value}
                </span>
              </div>
            ))}

            {/* Onderhoudstabel */}
            <MaintenanceTable />

            {/* Product informatie */}
            <div className="flex flex-col col-span-1 sm:col-span-2 row-span-2 mb-2">
              <span className="text-lg font-medium mb-1">Product informatie</span>
              <span className="text-lg bg-gray-200 
                pl-5 pr-3 py-2 max-h-48 min-h-48 rounded overflow-y-auto">
                {machine.product_informatie}
              </span>
            </div>
    
            <div className="flex flex-col col-span-1 sm:col-span-2 mb-2 justify-end">
              <span className="text-lg font-medium mb-1">Volgend geplande onderhoud</span>
              <span className="text-lg bg-gray-200 pl-5 pr-3 py-1 rounded">
                09/02/2025
              </span>
            </div>

          </div>

          <div className="mt-14">
            <button
              disabled={isMutating}
              onClick={toggleMachineStatus}
              className={`w-full 
                ${machine.status === 'DRAAIT' ? 
      'bg-red-500 enabled:hover:bg-red-600' : 
      'bg-green-500 enabled:hover:bg-green-600'} 
                font-bold py-3 md:py-4 text-xl md:text-3xl px-4 
                border border-black rounded flex justify-center items-center`}
            >
              {isMutating 
                ? 'Even geduld...' 
                : machine.status === 'DRAAIT' 
                  ? 'STOP' 
                  : 'START'}
            </button>
            <span className="block mt-2 text-sm md:text-base text-center md:text-left">
              Verantwoordelijke wordt verwittigd
            </span>
          </div>
        </div>
      </AsyncData>
    </>
  );
};

export default MachineDetail;