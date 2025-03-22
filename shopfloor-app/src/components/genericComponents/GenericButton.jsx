const GenericButton = ({ onClick, text, icon: Icon }) => {
  return (
    <button 
      className="bg-red-500 hover:cursor-pointer hover:bg-red-700 
          text-white font-bold py-2 px-4 
          rounded flex items-center gap-x-2 mb-6 mt-10"
      onClick={onClick}
    >
      <Icon />
      {text}
    </button>
  );
};

export default GenericButton;