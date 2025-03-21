export function convertStatus(status) {
  const statusMap = {
    'IN_ONDERHOUD': { text: 'IN ONDERHOUD', color: 'orange' },
    'MANUEEL_GESTOPT': { text: 'MANUEEL GESTOPT', color: 'red' },
    'AUTOMATISCH_GESTOPT': { text: 'AUTOMATISCH GESTOPT', color: 'red' },
    'DRAAIT': { text: 'DRAAIT', color: 'green' },
    'STARTBAAR': { text: 'STARTBAAR', color: 'green'},
  };
  return statusMap[status] || { text: 'Ongekende status', color: 'black', bold: false };
}

