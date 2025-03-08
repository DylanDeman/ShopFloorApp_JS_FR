const TableRow = ({ data, columns, onShow, onShowGrondplan, cellProps = () => ({}) }) => {
import { MdEdit } from 'react-icons/md';

const TableRow = ({ data, columns, onShow, onEdit }) => {
  return (
    <tr className="border border-gray-300 hover:bg-gray-50" data-cy={`table-row-${data.id}`}>
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
        <td 
          key={index} 
          className="border border-gray-300 px-4 md:py-2 text-center"
          data-cy={`table-cell-${column}-${data.id}`} 
          {...cellProps(column, data)}
        >
          {data[column]}
        </td>
      ))}
      {(onShow || onShowGrondplan) && (
        <td className="border border-gray-300 px-1 py-1 text-center" data-cy={`table-actions-${data.id}`}>
          <div className="inline-flex gap-2">
            {onShow && (
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                onClick={() => onShow(data.id)}
                data-cy={`button-details-${data.id}`}
              >
                Details
              </button>
            )}
            {onShowGrondplan && (
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                onClick={() => onShowGrondplan(data.id)}
                data-cy={`button-grondplan-${data.id}`}
              >
                Grondplan
              </button>
            )}
      
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