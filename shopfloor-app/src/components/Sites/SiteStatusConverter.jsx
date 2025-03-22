export function convertSiteStatus(status) {
  const statusMap = {
    'ACTIEF': { text: 'ACTIEF', color: 'green' },
    'INACTIEF': { text: 'INACTIEF', color: 'red' },
  };
  return statusMap[status] || { text: 'Ongekende status', color: 'black', bold: false };
}