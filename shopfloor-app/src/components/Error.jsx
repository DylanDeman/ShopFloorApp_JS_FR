import { useEffect } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Error({ error }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAxiosError(error) && error?.response?.status === 403) {
      navigate('/not-found');
    }
  }, [error, navigate]);

  if (isAxiosError(error)) {
    return (
      <div 
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
        data-cy="error-message"
      >
        <h4 className="font-bold text-lg">Oeps, er is iets mis gegaan...</h4>
        <p className="mt-1">
          {error?.response?.data?.message || error.message}
          {error?.response?.data?.details && (
            <>
              :
              <br />
              <span className="text-sm font-mono bg-red-200 p-1 rounded">
                {JSON.stringify(error.response.data.details)}
              </span>
            </>
          )}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
        <h4 className="font-bold text-lg">Er is een onverwachte fout opgetreden</h4>
        <p className="mt-1 text-sm font-mono bg-yellow-200 p-1 rounded">
          {error.message || JSON.stringify(error)}
        </p>
      </div>
    );
  }

  return null;
}