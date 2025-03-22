import { 
  MdKeyboardArrowDown, 
  MdKeyboardArrowRight, 
  MdKeyboardDoubleArrowDown, 
  MdKeyboardDoubleArrowRight, 
  MdKeyboardArrowUp, 
  MdKeyboardArrowLeft,
  MdKeyboardDoubleArrowUp, 
  MdKeyboardDoubleArrowLeft, 
} from 'react-icons/md';
  
export default function MachineSelector({ availableMachines, selectedMachines, onMachineMove }) {
  const formatMachineDisplay = (machine) => {
    if (machine.code && machine.locatie) {
      return `${machine.code} - ${machine.locatie}`;
    }
    if (machine.code) {
      return machine.code;
    }
    if (machine.locatie) {
      return machine.locatie;
    }
    return `Machine #${machine.id}`;
  };
  
  // Verplaat machine van beschikbaar naar geselecteerd
  const moveToSelected = () => {
    const selected = document.querySelector('#availableMachines').selectedOptions;
    if (selected.length > 0) {
      const selectedIds = Array.from(selected).map((option) => parseInt(option.value));
      onMachineMove.moveToSelected(selectedIds);
    }
  };
  
  // Verplaatst machine van geselecteerd naar beschikbaar
  const moveToAvailable = () => {
    const selected = document.querySelector('#selectedMachines').selectedOptions;
    if (selected.length > 0) {
      const selectedIds = Array.from(selected).map((option) => parseInt(option.value));
      onMachineMove.moveToAvailable(selectedIds);
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
      <div className="w-full md:w-5/12">
        <h3 className="text-sm mb-1">Beschikbare machines</h3>
        <p className="text-xs text-gray-500 mb-2">(selecteer de rij(en) die aan deze site gelinkt worden)</p>
        <select
          id="availableMachines"
          multiple
          className="w-full h-36 md:h-48 border rounded p-2"
          size="8"
          data-cy="available-machines"
        >
          {availableMachines.map((machine) => (
            <option key={machine.id} value={machine.id}>
              {formatMachineDisplay(machine)}
            </option>
          ))}
        </select>
      </div>
        
      <div className="w-full md:w-2/12 flex flex-row md:flex-col
       justify-center items-center space-x-2 md:space-x-0 md:space-y-2">
        <button
          type="button"
          className="bg-gray-200 hover:bg-gray-300 px-3
           py-1 rounded w-14 md:w-16 
           text-center flex justify-center items-center"
          onClick={moveToSelected}
          data-cy="move-to-selected"
        >
          <span className="block md:hidden">
            <MdKeyboardArrowDown size={18} />
          </span>
          <span className="hidden md:block">
            <MdKeyboardArrowRight size={18} />
          </span>
        </button>
        <button
          type="button"
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 
          rounded w-14 md:w-16 text-center flex justify-center items-center"
          onClick={onMachineMove.moveAllToSelected}
          data-cy="move-all-to-selected"
        >
          <span className="block md:hidden">
            <MdKeyboardDoubleArrowDown size={18} />
          </span>
          <span className="hidden md:block">
            <MdKeyboardDoubleArrowRight size={18} />
          </span>
        </button>
        <button
          type="button"
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 
          rounded w-14 md:w-16 text-center flex justify-center items-center"
          onClick={moveToAvailable}
          data-cy="move-to-available"
        >
          <span className="block md:hidden">
            <MdKeyboardArrowUp size={18} />
          </span>
          <span className="hidden md:block">
            <MdKeyboardArrowLeft size={18} />
          </span>
        </button>
        <button
          type="button"
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 
          rounded w-14 md:w-16 text-center flex justify-center items-center"
          onClick={onMachineMove.moveAllToAvailable}
          data-cy="move-all-to-available"
        >
          <span className="block md:hidden">
            <MdKeyboardDoubleArrowUp size={18} />
          </span>
          <span className="hidden md:block">
            <MdKeyboardDoubleArrowLeft size={18} />
          </span>
        </button>
      </div>
        
      <div className="w-full md:w-5/12">
        <h3 className="text-sm mb-1">Geselecteerde machines</h3>
        <select
          id="selectedMachines"
          multiple
          className="w-full h-36 md:h-48 border rounded p-2"
          size="8"
          data-cy="selected-machines"
        >
          {selectedMachines.map((machine) => (
            <option key={machine.id} value={machine.id}>
              {formatMachineDisplay(machine)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}