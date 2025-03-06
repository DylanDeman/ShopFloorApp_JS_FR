const TableRow = ({ data, columns, onShow, onShowGrondplan }) => {
  return (
    <tr className="border border-gray-300 hover:bg-gray-50">
      {columns.map((column, index) => (
        <td key={index} className="border border-gray-300 px-4 md:py-2 text-center">
          {data[column]}
        </td>
      ))}
      {onShow && (
        <td className="border border-gray-300 px-1 py-1 text-center">
          <div className="inline-flex gap-2">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              onClick={() => onShow(data.id)}
            >
              Details
            </button>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              onClick={() => onShowGrondplan(data.id)}
            >
              Grondplan
            </button>
          </div>
        </td>
      )}
    </tr>
  );
};

export default TableRow;
