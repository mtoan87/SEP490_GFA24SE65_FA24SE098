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

export const getChildDetail = async (childId) => {
  try {
    const response = await api.get(`/api/Children/GetChildDetails/${childId}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching children details:", error);
    throw error;
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

export const getHouseDetail = async (houseId) => {
  try {
    const response = await api.get(`/api/Houses/GetHouseDetails/${houseId}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching houses details:", error);
    throw error;
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

//TransferRequest
export const getTransferRequest = async () => {
  try {
    const response = await api.get("/api/TransferRequest");
    return response.data;
  } catch (error) {
    console.error("Error fetching Transfer Request:", error);
    throw error;
  }
};

//TransferHistory
export const getTransferHistory = async () => {
  try {
    const response = await api.get("/api/TransferHistory");
    return response.data;
  } catch (error) {
    console.error("Error fetching Transfer History:", error);
    throw error;
  }
};

//School
export const getSchoolWithImages = async (showDeleted = false) => {
  try {
    const endpoint = showDeleted
      ? "/api/Houses/GetAllSchoolsIsDeleted"
      : "/api/Houses/GetAllSchoolWithImg";
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching Schools data:", error);
    return [];
  }
};

//Subject
export const getSubjectDetail = async () => {
  try {
    const response = await api.get("/api/SubjectDetail");
    return response.data;
  } catch (error) {
    console.error("Error fetching Subjects:", error);
    throw error;
  }
};

//Activity
export const getActivityWithImages = async (showDeleted = false) => {
  try {
    const endpoint = showDeleted
      ? "/api/Village/GetAllActivityIsDelete"
      : "/api/Village/GetAllActivityWithImg";
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching Activities with image:", error);
    throw error;
  }
};

//ChildProgress
export const getChildProgress = async () => {
  try {
    const response = await api.get("/api/ChildProgress");
    return response.data;
  } catch (error) {
    console.error("Error fetching Child Progress:", error);
    throw error;
  }
};

//ChildNeed
export const getChildNeed = async () => {
  try {
    const response = await api.get("/api/ChildNeed");
    return response.data;
  } catch (error) {
    console.error("Error fetching Child Need:", error);
    throw error;
  }
};

//Inventory
export const getInventoryWithImages = async (showDeleted = false) => {
  try {
    const endpoint = showDeleted
      ? "/api/Village/GetAllInventoryIsDelete"
      : "/api/Village/GetAllInventoryWithImg";
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching Inventory with image:", error);
    throw error;
  }
};

export default api;
