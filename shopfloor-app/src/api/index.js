import axiosRoot from 'axios'; 
import { JWT_TOKEN_KEY } from '../contexts/Auth.context';

export const axios = axiosRoot.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor - adds token to requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(JWT_TOKEN_KEY);

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor - handles token expiration
axios.interceptors.response.use(
  (response) => response, 
  (error) => {
    // Check if error is due to an expired token (usually 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Remove the expired token from localStorage
      localStorage.removeItem(JWT_TOKEN_KEY);
      
      const pathname = window.location.pathname;
      window.location.href = `/login?redirect=${pathname}`;
    }
    
    return Promise.reject(error);
  },
);

export async function getAll(url) {
  const { data } = await axios.get(url); 
  return data;
}

export async function getById(url) {
  const {data} = await axios.get(url);
  return data;
}

export async function save(url, { arg: { id, ...data } }) {
  await axios({
    method: id ? 'PUT' : 'POST',
    url: `${url}/${id ?? ''}`,
    data,
  });
}

export const deleteById = async (url, { arg: id }) => {
  await axios.delete(`${url}/${id}`); 
};

export const post = async (url, { arg }) => {
  const { data } = await axios.post(url, arg);
  return data;
};

export const getKPIWaardenByKPIid = async (id) => {
  const { data } = await axios.get(`kpi/${id}/kpiwaarden`);  
  return data.items;
};

export const getDashboardByUserID = async (user_id) => {
  const {data } = await axios.get(`users/${user_id}/dashboard`);  
  return data.items;
};

export const getKPIsByRole = async (role) => {
  const { data } = await axios.get(`kpi/rol/${role}`);
  return data.items;
};