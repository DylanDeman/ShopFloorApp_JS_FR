import Tile from "./Tile";

const TileList = ({ tiles }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tiles.map((tile, index) => (
        <Tile key={index} title={tile.title} content={tile.content} />
      ))}
    </div>
  );
};

export default TileList;
