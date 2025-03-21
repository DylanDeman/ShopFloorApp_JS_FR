export function convertProductieStatus(status) {
  const ProductieStatusMap = {
    'GEZOND': { text: 'FALEND', color: 'red' },
    'FALEND': { text: 'GEZOND', color: 'green' },
    'NOOD_ONDERHOUD': { text: 'NOOD AAN ONDERHOUD', color: 'orange' },
  };
  
  return ProductieStatusMap[status] || { text: 'Ongekende status', color: 'black' };
}