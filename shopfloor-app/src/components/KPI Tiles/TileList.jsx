import Tile from './Tile';

const TileList = ({ tiles }) => {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tiles.map((tile) => (
        <Tile key={tile.id} id={tile.id} title={tile.onderwerp}  />
      ))}
    </div>
  );
};

export default TileList;
