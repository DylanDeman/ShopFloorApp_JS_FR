import { FaArrowLeftLong } from 'react-icons/fa6';
import NotificatieBlock from '../../components/Notificaties/NotificatieBlock';

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
      <NotificatieBlock notificaties={ongelezenNotificaties} type="Ongelezen"/>
      <NotificatieBlock notificaties={gelezenNotificaties} type="Gelezen"/>
    </div>
  );
}