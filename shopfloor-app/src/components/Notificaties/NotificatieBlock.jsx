import Notificatie from './Notificatie';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useState } from 'react';

export default function NotificatieBlock({notificaties, type}){

  const [notifsOpen, setNotifsOpen] = useState(false);

  const handleNotifsOpen = () => {
    setNotifsOpen(!notifsOpen);
  };

  return (
    <div className='border border-gray-500 rounded mb-4'>
      <div className="pl-8">
        <div className='flex flex-row items-center'>
          <h2 className="items-center text-2xl mb-4 mt-4 font-semibold w-full">
            {type} berichten ({notificaties.length}) 
          </h2>
          <div className='text-3xl mr-4' onClick={handleNotifsOpen}>
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