import Notificatie from "../../components/Notificaties/Notificatie";

export default function NotificatieList({notificaties}){

    if(!notificaties){
        return (
            <div className="grid justify-center">Geen ongelezen notificaties gevonden!</div>
        )
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-3 border border-gray-300
             w-full bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
                <span className="p-3">Tijdstip</span>
                <span className="p-3">Bericht</span>
            </div>
            {notificaties.items.map((notificatie) => 
            <Notificatie key={notificatie.id} tijdstip={notificatie.tijdstip} bericht={notificatie.bericht}/>)}
        </div>
    );
}