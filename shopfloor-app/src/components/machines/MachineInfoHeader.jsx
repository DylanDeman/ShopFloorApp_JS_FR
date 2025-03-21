import { StatusDisplay } from './StatusDisplay';

const MachineInfoHeader = ({ machine }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">Machine informatie</h2>
      </div>
      <div className="flex flex-col">
        <h2 data-cy="machine_status" className="text-xl md:text-2xl font-semibold mb-2">
          Status: <StatusDisplay status={machine.status} />
        </h2>
      </div>
    </div>
  );
};

export default MachineInfoHeader;