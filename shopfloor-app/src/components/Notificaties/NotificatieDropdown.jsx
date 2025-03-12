import useSWRMutation from 'swr/mutation';
import { save } from '../../api';

export default function NotificatieDropdown({id, bericht, tijdstip}){

  const {
    trigger: markAsRead,
  } = useSWRMutation('notificaties', save, {method: 'PUT'}); 

  const handleMarkAsRead = async () => {
    await markAsRead({id, tijdstip, bericht, gelezen: true});
  };

  return(
    <div
      className="flex flex-col p-2 mb-1 bg-gray-100 rounded hover:bg-gray-200 transition"
      key={id}
    >
      <span className="text-sm font-medium">{bericht}</span>
      <span className="text-xs text-gray-500">{new Date(tijdstip).toLocaleDateString()}</span>
      <span className="hover:cursor-pointer text-xs hover:text-sm transition-all" 
        onClick={handleMarkAsRead}>Markeer als gelezen
      </span>
    </div>
  );
}