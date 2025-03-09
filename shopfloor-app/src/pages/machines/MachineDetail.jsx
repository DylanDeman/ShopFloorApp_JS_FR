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
    { label: 'Naam site', value: 'naam site' },
    { label: 'Verantwoordelijke site', value: 'naam verantwoordelijke' },
    { label: 'Locatie', value: 'naam locatie' },
    { label: 'Technieker', value: 'naam technieker' },
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
          {/* Machine information header - responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">Machine informatie</h2>
              <span className="text-base md:text-lg font-bold">Uptime: </span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">Status: {machine.status}</h2>
              <span className="text-xl md:text-2xl font-medium">Productiestatus: {machine.productieStatus}</span>
            </div>
          </div>

          {/* Site data grid - adapts from 1 to 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-6">
            {siteData.map((site, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-lg font-medium mb-1">{site.label}</span>
                <span className="text-lg bg-gray-200 pl-5 pr-3 py-2 rounded">
                  {site.value}
                </span>
              </div>
            ))}
    
            {/* Responsive spanning elements */}
            <div className="flex flex-col col-span-1 sm:col-span-2 mb-2">
              <span className="text-lg font-medium mb-1">Recente onderhouden</span>
              {/* Hier komt eent tabel */}
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Datum</th>
                    <th className="text-left">Naam technieker</th>
                    <th className="text-left">Dagen geleden</th>
                    <th className="text-left">{/* Voor bekijk */}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>12/12/2021</td>
                    <td>Jan Janssens</td>
                    <td>2</td>
                    <td>
                      <button className="text-blue-500 hover:text-blue-700">Bekijk</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
    
            <div className="flex flex-col col-span-1 sm:col-span-2 row-span-2 mb-2">
              <span className="text-lg font-medium mb-1">Product informatie</span>
              <span className="text-lg bg-gray-200 pl-5 pr-3 py-2 max-h-48 md:max-h-64 rounded overflow-y-auto">
                qsdfqsqsdfqsdfqdsfqdsfffffffffffffffffffffffffffffffffffffffffff
                qsdfqsqsdfqsdfqdsfqdsfffffffffffffffffffffffffffffffffffffffffff
                qsdfqsqsdfqsdfqdsfqdsfffffffffffffffffffffffffffffffffffffffffff
                qsdfqsqsdfqsdfqdsfqdsfffffffffffffffffffffffffffffffffffffffffff
                qsdfqsqsdfqsdfqdsfqdsfffffffffffffffffffffffffffffffffffffffffff
                qsdfqsqsdfqsdfqdsfqdsfffffffffffffffffffffffffffffffffffffffffff
                qsdfqsqsdfqsdfqdsfqdsfffffffffffffffffffffffffffffffffffffffffff
                qsdfqsqsdfqsdfqdsfqdsfffffffffffffffffffffffffffffffffffffffffff
                qsdfqsqsdfqsdfqdsfqdsfffffffffffffffffffffffffffffffffffffffffff
                qsdfqsqsdfqsdfqdsfqdsfffffffffffffffffffffffffffffffffffffffffff
              </span>
            </div>
    
            <div className="flex flex-col col-span-1 sm:col-span-2 mb-2">
              <span className="text-lg font-medium mb-1">Recente onderhouden</span>
              <span className="text-lg bg-gray-200 pl-5 pr-3 py-2 rounded">
                qsdfqsf
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button className="w-full bg-red-500 hover:bg-red-600 font-bold py-3 md:py-4 text-xl md:text-3xl px-4 border border-black rounded ">
              STOP
            </button>
            <span className="block mt-2 text-sm md:text-base text-center md:text-left">Verantwoordelijke wordt verwittigd</span>
          </div>
        </div>
      </AsyncData>
    </>
  );
};

export default MachineDetail;