import SiteTable from "../components/Sites/SiteTable";
import AsyncData from "../components/AsyncData";
import filteredSites from '../api/mocksites.json'
const Sites = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 my-4 ml-50">Sites</h1>
      <div>
        <AsyncData>
          <SiteTable sites={filteredSites} />
        </AsyncData>
      </div>
    </div>
  );
}
export default Sites;