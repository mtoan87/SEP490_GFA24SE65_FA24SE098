import axios from "axios";

const baseURL = "https://soschildrenvillage.azurewebsites.net/";

const api = axios.create({
  baseURL: baseURL,
});

// Children
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

// Houses
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

// Villages
export const getVillagesWithImages = async (showDeleted = false) => {
  try {
    const endpoint = showDeleted
      ? "/api/Village/GetAllVillageIsDelete"
      : "/api/Village/GetAllVillageWithImg";
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching Villages with image:", error);
    throw error;
  }
};

export const getVillageDetail = async (villageId) => {
  try {
    const response = await api.get(`/api/Village/GetVillageDetailsWithHouses/${villageId}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching village details:", error);
    throw error;
  }
};

//Events
export const getEventsWithImages = async (showDeleted = false) => {
  try {
    const endpoint = showDeleted
      ? "/api/Event/GetAllEventsIsDelete"
      : "/api/Event";
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching Villages with image:", error);
    throw error;
  }
};

//Academic Report
export const getAcademicReport = async () => {
  try {
    const response = await api.get("/api/AcademicReport");
    return response.data;
  } catch (error) {
    console.error("Error fetching children:", error);
    throw error;
  }
};

//Health Report
export const getHealthReport = async () => {
  try {
    const response = await api.get("/api/HealthReport");
    return response.data;
  } catch (error) {
    console.error("Error fetching children:", error);
    throw error;
  }
};

//User Accounts
export const getAccount = async (showDeleted = false) => {
  try {
    //const response = await api.get("/api/UserAccount");
    const endpoint = showDeleted
      ? "/api/UserAccount/GetAllUserIsDelete"
      : "/api/UserAccount";
    const response = await api.get(endpoint);
    return response.data?.$values || []; //nếu trả data là $values thì nhận luôn
  } catch (error) {
    console.error("Error fetching User Account:", error);
    throw error;
  }
};

export default api;
