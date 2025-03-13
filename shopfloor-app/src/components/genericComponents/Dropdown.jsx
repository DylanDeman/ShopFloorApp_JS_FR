import { useState } from 'react';

export default function Dropdown({ label, options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 hover:cursor-pointer focus:outline-none"
      >
        {label}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white bg-opacity-100 border
         border-gray-200 rounded-lg shadow-lg z-10">
          <ul className="py-2">
            {options.map((option) => (
              <li key={option.id}>
                <button
                  className="w-full text-left block px-4 py-2 hover:bg-gray-200 focus:bg-gray-300 focus:outline-none"
                  onClick={() => {
                    onSelect(option.id);
                    setIsOpen(false);
                  }}
                >
                  {option.onderwerp}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
