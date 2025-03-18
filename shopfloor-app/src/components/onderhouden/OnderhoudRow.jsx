import { MdEdit } from 'react-icons/md';

const OnderhoudRow = ({ data, columns, onEdit, cellProps = () => ({}) }) => {

  return (
    <tr className="border border-gray-300 hover:bg-gray-50" data-cy={`table-row-${data.id}`}>
      {/* Edit Button */}
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

      {/* Data Columns */}
      {columns.map((column, index) => {
        console.log(column);
        return column === 'onderhoudsrapport' ? 
          <td key={index}
            className="border border-gray-300 px-4 md:py-2 text-center"
          >
            <button>Genereer rapport</button>
          </td>
          : (
            <td
              key={index}
              className="border border-gray-300 px-4 md:py-2 text-center"
              data-cy={`table-cell-${column}-${data.id}`}
              {...cellProps(column, data)}
            >
              {data[column]}
            </td>
          );
      })}

    </tr>
  );
};

export default OnderhoudRow;
