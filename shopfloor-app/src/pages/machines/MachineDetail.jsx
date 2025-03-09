import Information from '../../components/Information';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { getById } from '../../api/index';
import AsyncData from '../../components/AsyncData';
import { FaArrowLeft } from 'react-icons/fa';
import MachineInfoHeader from '../../components/machines/MachineInfoHeader';
import MaintenanceTable from '../../components/machines/MaintenanceTableMachine';

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
  console.log(machine);

  const siteData = [
    { label: 'Naam site', value: machine.site_id },
    { label: 'Verantwoordelijke site', value: machine.verantwoordelijke_site_id },
    { label: 'Locatie', value: machine.locatie },
    { label: 'Technieker', value: machine.technieker_gebruiker_id },
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
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
                Molestiae perferendis accusamus, eius placeat error repudiandae, 
                totam ipsum accusantium assumenda vitae labore cupiditate et 
                dolorem, modi quasi soluta optio voluptas animi.
                Aliquid assumenda eos quis voluptates voluptatum iure ipsam, 
                quia quod a tempora molestiae nesciunt nobis sapiente esse deserunt 
                hic magnam quas possimus adipisci, nisi distinctio? Consequuntur itaque placeat esse delectus.
                Adipisci deleniti, error quae sed repellat inventore doloribus 
                illum quas enim autem delectus culpa consequatur veniam fugit 
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
              className="w-full bg-red-500 hover:bg-red-600 
              font-bold py-3 md:py-4 text-xl md:text-3xl px-4 
              border border-black rounded ">
              STOP
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