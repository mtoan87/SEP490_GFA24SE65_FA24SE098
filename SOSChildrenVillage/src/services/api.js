import axios from 'axios';

const baseURL = 'https://localhost:7073';

const api = axios.create({
  baseURL: baseURL,
});

// export const getChild = async () => {
//   try {
//     const response = await api.get('/api/Children');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching children:', error);
//     throw error;
//   }
// };

export const getChildWithImages = async () => {
  try {
    const response = await api.get('/api/Children/GetAllChildWithImg');
    return response.data;
  } catch (error) {
    console.error('Error fetching children with image:', error);
    return [];
  }
};

export const getHouses = async () => {
  try {
    const response = await api.get('/api/Houses/GetAllHousesWithImg');
    return response.data;
  } catch (error) {
    console.error('Error fetching Houses with image:', error);
    throw error;
  }
};

export const getAccount = async () => {
  try {
    const response = await api.get('/api/UserAccount');
    return response.data;
  } catch (error) {
    console.error('Error fetching User Account:', error);
    throw error;
  }
};

export default api;