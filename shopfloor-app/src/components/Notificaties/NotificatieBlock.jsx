import Notificatie from './Notificatie';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useState } from 'react';

export default function NotificatieBlock({notificaties, type}){

  const [notifsOpen, setNotifsOpen] = useState(false);

  const handleNotifsOpen = () => {
    setNotifsOpen(!notifsOpen);
  };

  if(notificaties.length === 0){
    return (
      <div className='border border-gray-500 rounded mb-4 pl-8'>
        <h2 className='text-2xl mb-4 mt-4 font-semibold w-full'>Geen
          {new String(` ${type} `).toLocaleLowerCase()} 
          notificaties</h2>
      </div>
    );
  }

  return (
    <div className='border border-gray-500 rounded mb-4'>
      <div className="pl-8">
        <div className='flex flex-row items-center' onClick={handleNotifsOpen}>
          <h2 className="items-center text-2xl mb-4 mt-4 font-semibold w-full">
            {type} berichten ({notificaties.length}) 
          </h2>
          <div className='text-3xl mr-4'>
            {notifsOpen ? <IoIosArrowUp/> : <IoIosArrowDown/> }
          </div>
        </div>
        {notifsOpen ? <div>
          {notificaties.map((notificatie) => 
            <Notificatie 
              key={notificatie.id} id={notificatie.id} tijdstip={notificatie.tijdstip} bericht={notificatie.bericht}
            />)}
        </div> : ''}
      </div>
    </div>
  );
}