import Notificatie from '../../components/Notificaties/Notificatie';
import { FaArrowLeftLong } from 'react-icons/fa6';

export default function NotificatieList({notificaties}){

  if(!notificaties){
    return (
      <div className="grid justify-center">Geen ongelezen notificaties gevonden!</div>
    );
  }

  const ongelezenNotificaties = notificaties.items.filter((notificatie) => !notificatie.gelezen);
  const gelezenNotificaties = notificaties.items.filter((notificatie) => notificatie.gelezen);

  return (
    <div className="w-full">
      <div className='flex flex-row items-center gap-1 text-3xl mt-8 mb-8'>
        <FaArrowLeftLong className="transition-transform"/>
        <h1>
          Notificaties
        </h1>
      </div>
      <div className='border border-gray-500 rounded'>
        <div className="pl-8">
          <h2 className='text-2xl mb-4 mt-4 font-semibold'>Ongelezen berichten ({ongelezenNotificaties.length})</h2>
          <div>
            {ongelezenNotificaties.map((notificatie) => 
              <Notificatie 
                key={notificatie.id} id={notificatie.id} tijdstip={notificatie.tijdstip} bericht={notificatie.bericht}
              />)}
          </div>
        </div>
      </div>
      <div className='border border-gray-500 rounded mt-4'>
        <div className="pl-8">
          <h2 className='text-2xl mb-4 mt-4 font-semibold'>Gelezen berichten ({gelezenNotificaties.length})</h2>
          <div>
            {gelezenNotificaties.map((notificatie) => 
              <Notificatie 
                key={notificatie.id} id={notificatie.id} tijdstip={notificatie.tijdstip} bericht={notificatie.bericht}
              />)}
          </div>
        </div>
      </div>
    </div>
  );
}