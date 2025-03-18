import { MdEdit } from 'react-icons/md';

const MachineOnderhoudenRow = ({ data, columns, onShow, onEdit, onShowGrondplan, cellProps = () => ({}) }) => {
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
              <td className="border-gray-300 px-1 py-1 text-center">
                <div
                  className="inline-flex gap-2"
                  onClick={() => onShow(data.id)}
                  data-cy={`button-onderhouden-${data.id}`}
                >
                  <span className="font-bold hover:cursor-pointer hover:underline hover:text-red-700 transition-all">
                    Onderhouden
                  </span>
                </div>
              </td>
            )}
          </div>
        </td>
      )}
    </tr>
  );
};

export default MachineOnderhoudenRow;
