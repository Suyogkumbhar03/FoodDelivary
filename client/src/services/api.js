import axios from 'axios';

const getApiBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  url = url.trim().replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url += '/api';
  }
  return url;
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getRestaurants = async (params = {}) => {
  try {
    const response = await api.get('/restaurants', { params });
    return response.data;
  } catch (error) {
    console.error('API Error in getRestaurants:', error);
    throw error;
  }
};

export const getRestaurantById = async (id) => {
  try {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  } catch (error) {
    console.error(`API Error in getRestaurantById (${id}):`, error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await api.get ? await api.post('/orders', orderData) : null;
    return response.data;
  } catch (error) {
    console.error('API Error in createOrder:', error);
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`API Error in getOrderById (${id}):`, error);
    throw error;
  }
};

export default api;
