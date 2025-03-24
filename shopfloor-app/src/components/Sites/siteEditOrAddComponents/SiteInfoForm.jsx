export default function SiteInfoForm({ formData, verantwoordelijken, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      <div>
        <label className="block text-gray-700 mb-2">Naam</label>
        <input
          type="text"
          name="naam"
          value={formData.naam}
          onChange={onChange}
          className="w-full p-2 border rounded"
          placeholder="naam van de site"
          required
          data-cy="site-name"
        />
      </div>
  
      <div>
        <label className="block text-gray-700 mb-2">Verantwoordelijke</label>
        <select
          name="verantwoordelijke_id"
          value={formData.verantwoordelijke_id}
          onChange={onChange}
          className="w-full p-2 border rounded"
          required
          data-cy="verantwoordelijke-select"
        >
          <option 
            value={verantwoordelijken.filter(
              (verantwoordelijke) => verantwoordelijke.id == formData.verantwoordelijke_id).naam
            }>
            Selecteer verantwoordelijke</option>
          {verantwoordelijken.map((verantwoordelijke) => (
            <option key={verantwoordelijke.id} value={verantwoordelijke.id}>
              {verantwoordelijke.naam || verantwoordelijke.name || `User ${verantwoordelijke.id}`}
            </option>
          ))}
        </select>
      </div>
        
      <div>
        <label className="block text-gray-700 mb-2">Status van site</label>
        <select
          name="status"
          value={formData.status}
          onChange={onChange}
          className="w-full p-2 border rounded"
          data-cy="status-select"
        >
          <option value="ACTIEF">Actief</option>
          <option value="INACTIEF">Inactief</option>
        </select>
      </div>
    </div>
  );
}