import { FiBell } from 'react-icons/fi';

export default function NotificatieNavbar({notificaties}){

    if(!notificaties){
        return (
            <FiBell className="w-6 h-6 text-black hover:text-gray-600" />
        );
    }

    return (
        <>
            <FiBell className="w-6 h-6 text-black hover:text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 
                text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {notificaties.items.filter((notificatie) => !notificatie.gelezen).length}
            </span> 
        </>
    );
}