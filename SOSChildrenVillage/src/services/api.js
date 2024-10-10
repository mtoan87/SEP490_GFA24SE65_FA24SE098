import axios from 'axios';

const baseURL = 'https://localhost:7073';

const api = axios.create({
  baseURL: baseURL,
});

export const getChild = async () => {
  try {
    const response = await api.get('/api/Children');
    return response.data;
  } catch (error) {
    console.error('Error fetching children:', error);
    throw error;
  }
};

export const getHouses = async () => {
  try {
    const response = await api.get('/api/Houses');
    return response.data;
  } catch (error) {
    console.error('Error fetching Houses:', error);
    throw error;
  }
};

export default api;