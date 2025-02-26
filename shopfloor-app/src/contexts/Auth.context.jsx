import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import useSWRMutation from 'swr/mutation';
import * as api from '../api';
import useSWR from 'swr';
  
export const JWT_TOKEN_KEY = 'jwtToken';
export const AuthContext = createContext();

// Fuctie om te checken of token expired is
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};
  
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem(JWT_TOKEN_KEY);
    if (storedToken || isTokenExpired(storedToken)) { // Hier ook nog effectief checken of expired
      localStorage.removeItem(JWT_TOKEN_KEY);
      return null;
    }
    return storedToken;
  });

  useEffect(() => {
    if (!token) return;

    const checkTokenInterval = setInterval(() => {
      if (isTokenExpired(token)) {
        localStorage.removeItem(JWT_TOKEN_KEY);
        setToken(null);
      }
    }, 60000); 

    return () => clearInterval(checkTokenInterval);
  }, [token]);
  
  const {
    data: user, loading: userLoading, error: userError,
  } = useSWR(token ? 'users/me' : null, api.getById);
  
  const {
    isMutating: loginLoading,
    error: loginError,
    trigger: doLogin,
  } = useSWRMutation('sessions', api.post);
  
  const {
    isMutating: registerLoading,
    error: registerError,
    trigger: doRegister,
  } = useSWRMutation('users', api.post);
  
  const setSession = useCallback(
    (newToken) => {
      if (!newToken || isTokenExpired(newToken)) {
        setToken(null);
        localStorage.removeItem(JWT_TOKEN_KEY);
      } else if (newToken && !isTokenExpired(newToken)) {
        setToken(newToken);
        localStorage.setItem(JWT_TOKEN_KEY, newToken);
      }
    },
    [],
  );
  
  const login = useCallback(
    async (email, password) => {
      try {
        const { token: newToken } = await doLogin({
          email,
          password,
        });
  
        setSession(newToken);
        return !isTokenExpired(newToken);
  
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [doLogin, setSession],
  );
  
  const register = useCallback(
    async (data) => {
      try {
        const { token: newToken } = await doRegister(data);
        setSession(newToken);
        return !isTokenExpired(newToken);
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [doRegister, setSession],
  );
  
  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(JWT_TOKEN_KEY);
  }, []);
  
  const isAuthenticated = useMemo(() => 
    Boolean(token) && !isTokenExpired(token),
  [token],
  );
  
  const value = useMemo(
    () => ({
      user,
      error: loginError || userError || registerError,
      loading: loginLoading || userLoading || registerLoading,
      isAuthed: isAuthenticated,
      ready: !userLoading,
      login,
      logout,
      register,
    }),
    [isAuthenticated, user, loginError, loginLoading, userError, userLoading, registerError,
      registerLoading, login, logout, register],
  );
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};