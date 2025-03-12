const MachineInfoHeader = ({ machine }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">Machine informatie</h2>
        <span className="text-base md:text-lg font-bold">Uptime: WIP </span>
      </div>
      <div className="flex flex-col">
        <h2 data-cy="machine_status" className="text-xl md:text-2xl font-semibold mb-2">Status: {machine.status}</h2>
        <span data-cy="machine_productie_status" className="text-xl md:text-2xl font-medium">
          Productiestatus: {machine.productie_status}</span>
      </div>
    </div>
  );
};

export default MachineInfoHeader;