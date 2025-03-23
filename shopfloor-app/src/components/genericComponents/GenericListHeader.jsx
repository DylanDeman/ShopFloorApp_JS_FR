import Search from './Search';
import ListPageSizeSelector from './ListPageCountSelector';

export default function GenericListHeader({ 
  searhcPlaceholder, 
  zoekterm, 
  onSearch, 
  limit, 
  onLimitChange, 
  listPageSizeSelectorPlaceholder, 
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between">
      {/* Search input */}
      <Search 
        value={zoekterm} 
        onChange={onSearch} 
        placeholder={searhcPlaceholder}
      />

      {/* Page size selector */}
      <ListPageSizeSelector
        title={listPageSizeSelectorPlaceholder}
        limit={limit}
        onLimitChange={onLimitChange}
      />
    </div>
  );
}