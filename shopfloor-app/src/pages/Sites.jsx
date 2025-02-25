import SiteTable from "../components/Sites/SiteTable";
import { useState } from "react";
import useSWR from "swr";
import { getAll } from "../api";
import AsyncData from '../components/AsyncData';

const Sites = () => {
  const {
    data: sites = [],
    loading,
    error,
  } = useSWR('sites', getAll);

  const [sorteerVolgorde, setSorteerVolgorde] = useState(null);
  const [zoekterm, setZoekterm] = useState("");

  const sorteerSites = (sites) => {
    if (!sorteerVolgorde) return sites;
    return [...sites].sort((a, b) =>
      sorteerVolgorde === "asc" ? a.aantalMachines - b.aantalMachines : b.aantalMachines - a.aantalMachines
    );
  };

  const handleSort = () => {
    setSorteerVolgorde((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleSearch = (e) => {
    setZoekterm(e.target.value);
  };

  const filteredSites = sites.filter((site) =>
    site.naam.toLowerCase().includes(zoekterm.toLowerCase()) ||
    site.verantwoordelijke.toLowerCase().includes(zoekterm.toLowerCase())
  );

  const gesorteerdeSites = sorteerSites(filteredSites);

  return (
    <div className="flex-col md:flex-row flex justify-between p-6">
      <div className="w-full md:w-3/4 md:ml-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Zoek op naam of verantwoordelijke..."
            value={zoekterm}
            onChange={handleSearch}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
        </div>
        <AsyncData error={error} loading={loading}>
          <SiteTable sites={gesorteerdeSites} onSort={handleSort} sorteerVolgorde={sorteerVolgorde} />
        </AsyncData>
      </div>
    </div>
  );
};

export default Sites;
