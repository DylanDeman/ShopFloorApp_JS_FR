const SiteTableRow = ({ id, naam, verantwoordelijke, aantalMachines, onShow }) => {
  return (
    <tr className="border border-gray-300 hover:bg-gray-50">
      <td className="border border-gray-300 px-4 md:py-2 text-center">{id}</td>
      <td className="border border-gray-300 px-4 md:py-2">{naam}</td>
      <td className="border border-gray-300 px-4 md:py-2">{verantwoordelijke}</td>
      <td className="border border-gray-300 px-4 md:py-2">{aantalMachines}</td>
      <td className="border border-gray-300 px-4 md:py-2 text-center">
        <button className="bg-blue-500 text-white px-3 md:py-1 rounded hover:bg-blue-600 transition" onClick={() => onShow(id)}>Bekijk</button>
      </td>
    </tr>
  );
};

export default SiteTableRow;