import  { useState, useEffect } from 'react';
import { Stage, Layer, Text, Group } from 'react-konva';
import { MdFactory } from 'react-icons/md'; // Importing MdFactory from react-icons/md

// Helper function to check if two machines overlap
const isOverlapping = (machine, machines) => {
  return machines.some((otherMachine) => {
    const dx = machine.x - otherMachine.x;
    const dy = machine.y - otherMachine.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 150; // Prevent machines from being closer than 150px
  });
};

const Grondplan = ({ machines }) => {
  const [randomizedMachines, setRandomizedMachines] = useState([]); // State for the machine positions
  const [selectedMachine, setSelectedMachine] = useState(null); // State for the selected machine

  useEffect(() => {
    if (machines && machines.length > 0) {
      const randomMachines = [];

      // Define the factory floor space
      const gridWidth = 800;
      const gridHeight = 500;

      // Iterate through each machine and place them randomly within the constraints
      machines.forEach((machine) => {
        let newMachine = { ...machine };
        let validPosition = false;

        // Try generating a random position with more flexibility, still preventing overlap
        while (!validPosition) {
          // Random x and y within the factory floor space
          const x = Math.random() * (gridWidth - 100); // Leaving space from the edge
          const y = Math.random() * (gridHeight - 100); // Leaving space from the edge

          newMachine.x = x;
          newMachine.y = y;

          // Check if the machine overlaps with others
          if (!isOverlapping(newMachine, randomMachines)) {
            validPosition = true;
          }
        }

        randomMachines.push(newMachine);
      });

      setRandomizedMachines(randomMachines);
    }
  }, [machines]); // Only re-run when machines change

  // Helper function to determine icon color based on status
  const getIconColor = (status) => {
    if (status === 'DRAAIT') return 'green'; // Running
    return 'red'; // Maintenance or other statuses
  };

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      {/* Increased size for the title */}
      <h2 style={{ fontSize: '36px' }}>Site Grondplan</h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          border: '1px solid black',
          position: 'relative', // Required for absolute positioning of icons
        }}
      >
        <Stage width={800} height={500}>
          <Layer>
            {randomizedMachines.map((machine) => (
              <Group
                key={machine.id}
                x={machine.x}
                y={machine.y}
                onClick={() => setSelectedMachine(machine)} // Set the clicked machine
              >
                {/* Machine Name Text */}
                <Text
                  x={0}
                  y={55} // Ensure the text is below the machine icon
                  text={machine.name}
                  fontSize={12}
                  fill="black"
                  width={70} // Ensure the text fits within the bounds
                  align="center"
                />
              </Group>
            ))}
          </Layer>
        </Stage>

        {/* Render Machine Icons on top of the Konva Stage */}
        <div style={{ position: 'absolute', top: 0, left: 0 }}>
          {randomizedMachines.map((machine) => (
            <div
              key={machine.id}
              style={{
                position: 'absolute',
                top: machine.y, // Position of the machine icon
                left: machine.x, // Position of the machine icon
                zIndex: 1, // Ensure the icon is above the canvas
                cursor: 'pointer', // Make the icon clickable
              }}
              onClick={() => setSelectedMachine(machine)} // Icon click handler
            >
              {/* Increase the size of the MdFactory icon */}
              <MdFactory size={70} color={getIconColor(machine.status)} />
            </div>
          ))}
        </div>
      </div>

      {selectedMachine && (
        <div style={{ marginTop: 20, padding: 10, border: '1px solid gray' }}>
          <h3>{selectedMachine.name}</h3>
          <p><strong>ID:</strong> {selectedMachine.id}</p>
          <p><strong>Locatie:</strong> {selectedMachine.locatie}</p>
          <p><strong>Status:</strong> {selectedMachine.status}</p>
          <p><strong>Productie Status:</strong> {selectedMachine.productieStatus}</p>
        </div>
      )}
    </div>
  );
};

export default Grondplan;
