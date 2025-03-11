import useSWRMutation from 'swr/mutation';
import { save } from '../../api';

export default function Notificatie({id, tijdstip, bericht}){

  const {
    trigger: markAsRead,
  } = useSWRMutation('notificaties', save, {method: 'PUT'}); 

  const handleMarkAsRead = async () => {
    await markAsRead({id, tijdstip, bericht, gelezen: true});
  };

  return (
    <div className='border rounded flex flex-row gap-3 p-3 mb-6 mr-6'>
      <div className='flex items-center'>
        <p>{id}</p>
      </div>
      <div className='flex flex-col w-full'>
        <p className='font-semibold'>Datum: {tijdstip}</p>
        <p>{bericht}</p>
        <p className='font-semibold hover:cursor-pointer' onClick={handleMarkAsRead}>Markeer as gelezen</p>
      </div>
      <div className='flex items-center justify-end pl-4'>
        <p className='hover:cursor-pointer font-semibold transition-all hover:scale-105'>Bekijk</p>
      </div>
    </div>
  );
}