import { isAxiosError } from 'axios';

export default function Error({ error }) {
  if (isAxiosError(error)) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
        data-cy="error-message">
        <h4 className="font-bold text-lg">Oops, something went wrong</h4>
        <p className="mt-1">
          {error?.response?.data?.message || error.message}
          {error?.response?.data?.details && (
            <>
              :
              <br />
              <span className="text-sm font-mono bg-red-200 p-1 rounded">{JSON.stringify(error.response.data.details)}</span>
            </>
          )}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
        <h4 className="font-bold text-lg">An unexpected error occurred</h4>
        <p className="mt-1 text-sm font-mono bg-yellow-200 p-1 rounded">
          {error.message || JSON.stringify(error)}
        </p>
      </div>
    );
  }

  return null;
}
