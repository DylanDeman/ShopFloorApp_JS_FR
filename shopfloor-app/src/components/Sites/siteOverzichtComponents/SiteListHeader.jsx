import Search from '../../genericComponents/Search';
import ListPageCountSelector from '../../genericComponents/ListPageCountSelector';

export default function SiteListHeader({ zoekterm, onSearch, limit, onLimitChange }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between">
      {/* Search input */}
      <Search 
        value={zoekterm} 
        onChange={onSearch} 
        placeholder="Zoeken naar site, verantwoordelijke, ..."
      />
      
      {/* Page size selector - niet zichtbaar op small screens */}
      <ListPageCountSelector
        title="Aantal sites per pagina:"
        limit={limit}
        onLimitChange={onLimitChange}/>
    </div>
  );
}