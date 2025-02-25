const MachineTableRow = ({ id, locatie, status, productieStatus }) => {
    return (
      <tr className="border border-gray-300 hover:bg-gray-50">
        <td className="border border-gray-300 px-4 md:py-2 text-center">{id}</td>
        <td className="border border-gray-300 px-4 md:py-2">{locatie}</td>
        <td className="border border-gray-300 px-4 md:py-2">{status}</td>
        <td className="border border-gray-300 px-4 md:py-2">{productieStatus}</td>
        <td className="border border-gray-300 px-4 md:py-2 text-center">
          <button className="bg-blue-500 text-white px-3 md:py-1 rounded hover:bg-blue-600 transition">Bekijk</button>
        </td>
      </tr>
    );
  };
  
  export default MachineTableRow;