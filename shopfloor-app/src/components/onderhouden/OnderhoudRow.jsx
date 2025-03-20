import { MdEdit } from 'react-icons/md';
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import PdfDocument from './PdfDocument';

const fetchBase64Logo = async () => {
  try {
    const response = await fetch('/base64DelawareLogo.txt'); // Ensure the file is in the public directory
    const logoData = await response.text();
    return logoData; // Return the base64 string
  } catch (error) {
    console.error('Error loading base64 logo:', error);
    return ''; // Return an empty string or handle it as needed
  }
};

const handleRapport = async (machine, rowData) =>{
  rowData.machine = machine;
  const base64Logo = await fetchBase64Logo();
  const date = new Date(rowData.datum).toLocaleDateString();
  const blob = await pdf(<PdfDocument data={rowData} base64Logo={base64Logo} />).toBlob();
  saveAs(blob, `${rowData.id}-onderhoud-${date}_machine-${machine.code}.pdf`);
};

const OnderhoudRow = ({machine, data, columns, onEdit, cellProps = () => ({}) }) => {

  return (
    <tr className="border border-gray-300 hover:bg-gray-50" data-cy={`table-row-${data.id}`}>
      {onEdit && (
        <td className="border border-gray-300 px-2 py-2 text-center">
          <button
            className="text-gray-600 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-200"
            onClick={() => onEdit(data.id)}
            title="Edit"
          >
            <MdEdit size={20} />
          </button>
        </td>
      )}

      {columns.map((column, index) => {
        return column === 'onderhoudsrapport' ? 
          <td key={index}
            className="border border-gray-300 px-4 md:py-2 text-center"
          >
            <button className='hover:cursor-pointer hover:bg-[rgb(171,155,203)]
            ml-4 px-4 py-2 text-white 
            font-semibold rounded-lg bg-[rgba(171,155,203,0.8)] transition duration-300'
            onClick={() => handleRapport(machine, data)}>Genereer rapport
            </button>
          </td>
          : (
            <td
              key={index}
              className="border border-gray-300 px-4 md:py-2 text-center"
              data-cy={`table-cell-${column}-${data.id}`}
              {...cellProps(column, data)}
            >
              {data[column]}
            </td>
          );
      })}

    </tr>
  );
};

export default OnderhoudRow;
