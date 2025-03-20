import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/auth';
import { useNavigate } from 'react-router-dom';

export default function Logout({ seconden = 5 }) {
  const { isAuthed, logout } = useAuth();
  const [aantalSeconden, setAantalSeconden] = useState(seconden);
  const navigate = useNavigate();

  useEffect(() => {
    if (aantalSeconden <= 0) {
      logout();
      navigate('/login');
      return;
    }

    const timer = setTimeout(() => {
      setAantalSeconden((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [aantalSeconden, logout, navigate]);

  return (
    <div className="flex items-center justify-center mt-30">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md text-center">
        {isAuthed ? (
          <>
            <h1 className="text-2xl font-semibold text-gray-800">
              Logging out in
            </h1>
            <p className="text-4xl font-bold text-red-500 animate-pulse mt-2">
              {aantalSeconden}s
            </p>
          </>
        ) : (
          <h1 className="text-2xl font-semibold text-gray-800">
            You were successfully logged out
          </h1>
        )}
      </div>
    </div>
  );
}
