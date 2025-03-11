import { Link } from 'react-router-dom';
import NotificatieDropdown from './NotificatieDropdown';

export default function NotificatieListDropdown({ notificaties, toggleDropdown }) {
  if (!notificaties) {
    return (
      <div className="bg-white shadow-md rounded p-4 w-64">
        <p>Geen notificaties</p>
      </div>
    );
  }
  
  const ongelezenNotificaties = notificaties.items.filter(
    (notificatie) => !notificatie.gelezen);
  
  return (
    <div className='bg-white shadow-md rounded'>
      <div className="w-64 max-h-80 overflow-y-auto">
        <div className="p-3">
          <p className="font-bold">Notificaties</p>
        </div>
        <div className='pl-4 pr-4 pb-2'>
          {ongelezenNotificaties.length === 0 ? (
            <p className="text-gray-500">Geen ongelezen notificaties</p>
          ) : (
            ongelezenNotificaties.map((notificatie) => (
              <NotificatieDropdown 
                key={notificatie.id} id={notificatie.id} 
                bericht={notificatie.bericht} tijdstip={notificatie.tijdstip} />
            ))
          )}
        </div>
      </div>
      <div className='pl-4 pb-2'>
        <Link to='/notificaties' onClick={() => toggleDropdown()}>
          <p className='mt-2 font-bold text-sm'>Zie alle notificaties</p>
        </Link>
      </div>
    </div>
  );
}
  