const Site = ({ nr, naam, locatie, omschrijving, gezondheidsniveau, onderhoudsniveau, status }) => {
  return (
    <tr className="border border-gray-300 hover:bg-gray-50">
      <td className="border border-gray-300 px-4 py-2 text-center">{nr}</td>
      <td className="border border-gray-300 px-4 py-2">{naam}</td>
      <td className="border border-gray-300 px-4 py-2">{locatie}</td>
      <td className="border border-gray-300 px-4 py-2">{omschrijving}</td>
      <td className="border border-gray-300 px-4 py-2 text-center">{gezondheidsniveau}</td>
      <td className="border border-gray-300 px-4 py-2 text-center">{onderhoudsniveau + '%'}</td>
      <td className="border border-gray-300 px-4 py-2 text-center">{status}</td>
      <td className="border border-gray-300 px-4 py-2 text-center">
        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Bekijk</button>
      </td>
    </tr>
  );
};

export default Site;