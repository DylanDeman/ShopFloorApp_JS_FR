const MaintenanceTable = ({ maintenanceData}) => {

  return (
    <div className="flex flex-col col-span-1 sm:col-span-2 mb-2">
      <span className="text-lg font-medium mb-1">Recente onderhouden</span>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Datum</th>
            <th className="text-left">Naam technieker</th>
            <th className="text-left">Dagen geleden</th>
            <th className="text-left">{/* Voor bekijk */}</th>
          </tr>
        </thead>
        <tbody>
          {/* {maintenanceData.map((item, index) => (
            <tr key={index}>
              
              <td>{item.date}</td>
              <td>{item.technicianName}</td>
              <td>{item.daysAgo}</td>
              <td>
                <button className="text-blue-500 hover:text-blue-700">Bekijk</button>
              </td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceTable;