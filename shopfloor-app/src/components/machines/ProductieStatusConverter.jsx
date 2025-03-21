import { convertProductieStatus } from './ProductieConverter';
export const ProductieStatusDisplay = ({ status }) => {
  const { text, color } = convertProductieStatus(status);
  return <span style={{ color }}>{text}</span>;
};