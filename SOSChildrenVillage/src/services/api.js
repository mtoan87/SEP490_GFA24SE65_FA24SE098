import axios from "axios";

const baseURL = "https://localhost:7073";

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

/* export const getChildWithImages = async () => {
  try {
    const response = await api.get('/api/Children/GetAllChildWithImg');
    return response.data;
  } catch (error) {
    console.error('Error fetching children with image:', error);
    return [];
  }
}; */

export const getChildWithImages = async (showDeleted = false) => {
  try {
    const endpoint = showDeleted
      ? "/api/Children/GetAllChildIsDelete" // Trẻ đã xóa
      : "/api/Children/GetAllChildWithImg"; // Trẻ chưa xóa
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching children data:", error);
    return [];
  }
};

export const getHouseWithImages = async (showDeleted = false) => {
  try {
    const endpoint = showDeleted
      ? "/api/Houses/GetAllHousesIsDelete" // Nhà đã xóa
      : "/api/Houses/GetAllHousesWithImg"; // Nhà chưa xóa
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching Houses data:", error);
    return [];
  }
};

export const getVillages = async (showDeleted = false) => {
  try {
    const endpoint = showDeleted
      ? "/api/Houses/GetAllVillagesIsDelete" // Nhà đã xóa
      : "/api/Houses/GetAllVillagesWithImg"; // Nhà chưa xóa
      const response = await api.get(endpoint);
      return response.data;
  } catch (error) {
    console.error("Error fetching Villages with image:", error);
    throw error;
  }
};

export const getAccount = async () => {
  try {
    const response = await api.get("/api/UserAccount");
    return response.data;
  } catch (error) {
    console.error("Error fetching User Account:", error);
    throw error;
  }
};

export default api;
