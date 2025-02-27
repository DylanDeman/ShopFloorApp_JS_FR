const Tile = ({ title, content }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 m-4 max-w-sm w-full">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-700">{content}</p>
    </div>
  );
};

export default Tile;
