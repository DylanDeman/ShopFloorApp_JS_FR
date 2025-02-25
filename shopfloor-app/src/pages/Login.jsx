import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import LabelInputLogin from '../components/LabelInputLogin.jsx';
import { useAuth } from '../contexts/auth';
import Error from '../components/Error';
import Loader from '../components/Loader.jsx';

const Login = () => {
  const { search } = useLocation();
  const { error, loading, login } = useAuth();
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      email: 'robert.devree@hotmail.com', // Voorbeeld bestaat niet echt! TODO weghalen
      password: 'UUBE4UcWvSZNaIw',
    },
  });
  const { handleSubmit, reset, register } = methods;

  const handleCancel = useCallback(() => {
    reset();
  }, [reset]);

  const handleLogin = useCallback(
    async ({ email, password }) => {
      const loggedIn = await login(email, password);
      if (loggedIn) {
        const params = new URLSearchParams(search);
        navigate(params.get('redirect') || '/', { replace: true });
      }
    },
    [login, navigate, search]
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/login_achtergrond.svg')" }}>
      <div className="flex flex-col md:flex-row bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-11/12 max-w-4xl mt-15">
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-2xl font-bold mb-4">WELKOM!</h2>
          <p className="text-gray-600 text-sm mb-4">
            Nog geen account? Contacteer je verantwoordelijke, manager of een administrator!
          </p>

          <FormProvider {...methods}>
            <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
              <div>
              <LabelInputLogin
                label="Email:"
                name="email"
                type="email"
                placeholder="Example@delaware.com"
                validationRules={{ required: 'Email is verplicht' }}
              />
              </div>
              <div>
              <LabelInputLogin
                label="Wachtwoord:"
                name="password"
                type="password"
                placeholder="●●●●●●●●"
                validationRules={{ required: 'Wachtwoord is verplicht' }}
              />
              </div>
              <Error error={error}/>
              <p className="text-sm text-red-500 cursor-pointer">Wachtwoord vergeten?</p>
              <button
                type="submit"
                className="disabled:bg-red-400 enabled:hover:cursor-pointer w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                disabled={loading}
              >
                {loading ? <Loader/> : 'Aanmelden'}
              </button>
            </form>
          </FormProvider>
        </div>

        <div className="hidden md:block w-1/2">
          <img
            src="/login_groepsfoto.jpg"
            alt="Groepsfoto"
            className="rounded-r-lg object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
