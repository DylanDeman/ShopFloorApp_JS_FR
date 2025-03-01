import { useState } from "react";

export default function SitesList({sites}){
  const [status, setStatus] = useState('');
  const [locatie, setLocatie] = useState('');
  const [onderhoudsNiveau, setOnderhoudsNiveau] = useState(0);

  const locaties = [...new Set(sites.map((site) => site.locatie))];

  const filter = (sites) => {
    let filtered = sites;
    if (status) {
      filtered = filtered.filter((site) => site.status === status);
    }
    if (locatie) {
      filtered = filtered.filter((site) => site.locatie === locatie)
    }
    if (onderhoudsNiveau > 0) {
      filtered = filtered.filter((site) => site.onderhoudsniveau >= onderhoudsNiveau)
    }
    return filtered;
  };

  const filteredSites = filter(sites);

    return (
        <div className="flex-col md:flex-row flex justify-between p-6">
        <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-md md:space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
          <div>
            <label>
              <input
                type="checkbox"
                checked={status === 'Inactief'}
                onChange={() => setStatus(status === 'Inactief' ? '' : 'Inactief')}
                className="mr-2"
                data-cy="sites_filter_inactief"
              />
              Inactief
            </label>
          </div>
          <div>
            <label className="block text-gray-700">Locatie</label>
            <select
              onChange={(e) => setLocatie(e.target.value)}
              className="w-full border border-gray-300 rounded-lg md:p-2"
            >
              <option data-cy='sites_filter_optie_alleLocaties' value="">Alle locaties</option>
              {locaties.map((locatie, index) => (
                <option key={index} value={locatie}>
                  {locatie}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Onderhoudsniveau:</label>
            <input
              min="0"
              max="100"
              data-cy="sites_filter_onderhoudsniveau"
              value={onderhoudsNiveau}
              onChange={(e) => setOnderhoudsNiveau(Number(e.target.value))}
              type="range"
              className="w-full"
            />
            <span className="text-gray-700">{onderhoudsNiveau}%</span>
          </div>
        </div>
        <div className="w-full md:w-3/4 md:ml-6">
          <SiteTable sites={filteredSites} />
        </div>
      </div>
    );
};