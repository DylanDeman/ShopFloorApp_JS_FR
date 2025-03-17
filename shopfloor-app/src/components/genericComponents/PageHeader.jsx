import { FaArrowLeft } from 'react-icons/fa';

export default function PageHeader({ title, onBackClick }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-6 md:mb-12 mt-10">
      <button 
        className="text-gray-700 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 self-start"
        onClick={onBackClick}
        aria-label="Go back"
        data-cy="back-button"
      >
        <FaArrowLeft size={20} className="md:text-2xl" />
      </button>
        
      <h1 className="text-2xl md:text-4xl font-semibold">{title}</h1>
    </div>
  );
}