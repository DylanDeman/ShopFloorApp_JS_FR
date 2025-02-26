const Site = ({ id, naam, verantwoordelijke, aantalMachines}) => {
  return (
    <tr className="border border-gray-300 hover:bg-gray-50" data-cy="site">
      <td data-cy='site_id' className="border border-gray-300 px-4 md:py-2 text-center">{id}</td>
      <td data-cy='site_naam' className="border border-gray-300 px-4 md:py-2">{naam}</td>
      <td data-cy='site_verantwoordelijke' className="border border-gray-300 px-4 md:py-2">{verantwoordelijke}</td>
      <td data-cy='site_aantalMachines' className="border border-gray-300 px-4 md:py-2">{aantalMachines}</td>
      <td className="border border-gray-300 px-4 md:py-2 text-center">
        <button data-cy='site_details_button' className="bg-blue-500 text-white px-3 md:py-1 rounded hover:bg-blue-600 transition">Bekijk</button>
      </td>
    </tr>
  );
};

export default Site;