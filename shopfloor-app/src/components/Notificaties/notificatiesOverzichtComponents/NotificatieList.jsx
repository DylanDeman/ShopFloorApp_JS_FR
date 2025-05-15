import NotificatieBlock from './NotificatieBlock';

export default function NotificatieList({notificaties}){
  if(!notificaties){
    return (
      <div className="grid justify-center">Geen notificaties gevonden!</div>
    );
  }

  const ongelezenNotificaties = notificaties.items.filter((notificatie) => !notificatie.isread);
  const loginTime = new Date(localStorage.getItem('loginTime'));

  const nieuweNotificaties = ongelezenNotificaties.filter(
    (notificatie) => new Date(notificatie.time) >= loginTime);

  const overigeOngelezenNotificaties = ongelezenNotificaties.filter(
    (notificatie) =>
      !nieuweNotificaties.find((nieuw) => nieuw.id === notificatie.id),
  );

  const gelezenNotificaties = notificaties.items.filter((notificatie) => notificatie.isread);
  return (
    <div className="w-full">
      <NotificatieBlock notificaties={nieuweNotificaties} type="Nieuwe"/>
      <NotificatieBlock notificaties={overigeOngelezenNotificaties} type="Ongelezen"/>
      <NotificatieBlock notificaties={gelezenNotificaties} type="Gelezen"/>
    </div>
  );
}