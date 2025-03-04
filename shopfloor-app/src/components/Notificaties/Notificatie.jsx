export default function Notificatie({tijdstip, bericht}){
    return (
        <div className="grid grid-cols-3 gap-5 border border-gray-300 md:px-4 md:py-2 max-sm:px-0 max-sm:p-0 last-of-type:rounded-bl-md">
            <span className="p-3">{tijdstip}</span>
            <span className="p-3">{bericht}</span>
            <div className="flex justify-center align-middle h-fit ">
                <button className="hover:cursor-pointer p-2 w-fit bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    Markeer als gelezen 
                </button>
            </div>
        </div>
    );
}