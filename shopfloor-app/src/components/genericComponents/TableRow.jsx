import { MdEdit } from 'react-icons/md';

const TableRow = ({ data, columns, onShow, onEdit }) => {
  return (
    <tr className="border border-gray-300 hover:bg-gray-50">
      {/* Edit button wordt enkel getoond als onEdit is meegegeven in props */}
      {onEdit && (
        <td className="border border-gray-300 px-2 py-2 text-center">
          <button
            className="text-gray-600 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-200"
            onClick={() => onEdit(data.id)}
            title="Edit"
          >
            <MdEdit size={20} />
          </button>
        </td>
      )}
      
      {columns.map((column, index) => (
        <td key={index} className="border border-gray-300 px-4 md:py-2 text-center">
          {data[column]}
        </td>
      ))}
      
      {onShow && (
        <td className="border border-gray-300 px-1 py-1 text-center">
          <div 
            className="inline-flex gap-2"
            onClick={() => onShow(data.id)}
          >
            <span className="font-bold hover:cursor-pointer hover:underline hover:text-red-700 transition-all">
              Details
            </span>
          </div>
        </td>
      )}
    </tr>
  );
};

export default TableRow;