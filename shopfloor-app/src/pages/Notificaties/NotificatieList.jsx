import { FaArrowLeftLong } from 'react-icons/fa6';
import NotificatieBlock from '../../components/Notificaties/NotificatieBlock';
import { useNavigate } from 'react-router';

export default function NotificatieList({notificaties}){

  const navigate = useNavigate();

  if(!notificaties){
    return (
      <div className="grid justify-center">Geen notificaties gevonden!</div>
    );
  }

  const ongelezenNotificaties = notificaties.items.filter((notificatie) => !notificatie.gelezen);

  const loginTime = new Date(localStorage.getItem('loginTime'));

  const nieuweNotificaties = ongelezenNotificaties.filter(
    (notificatie) => new Date(notificatie.tijdstip) >= loginTime);

  const overigeOngelezenNotificaties = ongelezenNotificaties.filter(
    (notificatie) =>
      !nieuweNotificaties.find((nieuw) => nieuw.id === notificatie.id),
  );

  const gelezenNotificaties = notificaties.items.filter((notificatie) => notificatie.gelezen);

  return (
    <div className="w-full">
      <div className='flex flex-row items-center gap-1 text-3xl mt-8 mb-8 hover:cursor-pointer'
        onClick={() => navigate(-1)}>
        <FaArrowLeftLong className="transition-transform"/>
        <h1>
          Notificaties
        </h1>
      </div>
      <NotificatieBlock notificaties={nieuweNotificaties} type="Nieuwe"/>
      <NotificatieBlock notificaties={overigeOngelezenNotificaties} type="Ongelezen"/>
      <NotificatieBlock notificaties={gelezenNotificaties} type="Gelezen"/>
    </div>
  );
}