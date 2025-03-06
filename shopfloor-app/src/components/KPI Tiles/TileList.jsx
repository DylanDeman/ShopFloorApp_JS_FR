import Tile from './Tile';

const TileList = ({ tiles, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tiles.length > 0 ? (
        tiles.map((tile) => (
          <Tile key={tile.id} id={tile.id} title={tile.onderwerp} onDelete={onDelete} />
        ))
      ) : (
        <div className="col-span-full text-center text-gray-500 text-lg font-semibold p-4">
          Je hebt nog geen KPI&apos;s aan je dashboard toegevoegd.
        </div>
      )}
    </div>
  );
};

export default TileList;
