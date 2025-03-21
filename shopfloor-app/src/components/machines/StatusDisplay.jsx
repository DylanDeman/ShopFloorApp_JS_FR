import { convertStatus } from './StatusConverter';

export const StatusDisplay = ({ status }) => {
  const statusInfo = convertStatus(status);
  return (
    <span 
      style={{ 
        color: statusInfo.color, 
      }}
    >
      {statusInfo.text}
    </span>
  );
};