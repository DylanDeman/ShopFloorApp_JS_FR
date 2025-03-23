export function convertProductieStatus(status) {
  const ProductieStatusMap = {
    'FALEND': { text: 'FALEND', color: 'red' },
    'GEZOND': { text: 'GEZOND', color: 'green' },
    'NOOD_ONDERHOUD': { text: 'NOOD AAN ONDERHOUD', color: 'orange' },
  };
  
  return ProductieStatusMap[status] || { text: 'Ongekende status', color: 'black' };
}