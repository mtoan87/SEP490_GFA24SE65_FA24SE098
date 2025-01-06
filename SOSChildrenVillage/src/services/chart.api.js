import axios from "axios";

const baseURL = "https://soschildrenvillage.azurewebsites.net/";

const api = axios.create({
  baseURL: baseURL,
});

export const getActiveChildrenStat = async () => {
  try {
    const response = await api.get("/api/Dashboard/active-children");
    return response.data;
  } catch (error) {
    console.error("Error fetching active children stats:", error);
    return error;
  }
};

export const getTotalUsersStat = async () => {
  try {
    const response = await api.get("/api/Dashboard/total-users");
    return response.data;
  } catch (error) {
    console.error("Error fetching total users stats:", error);
    return error;
  }
};

export const getTotalEventsStat = async () => {
  try {
    const response = await api.get("/api/Dashboard/total-events");
    return response.data;
  } catch (error) {
    console.error("Error fetching total events stats:", error);
    return error;
  }
};

export const getVillageHouseDistribution = async () => {
  try {
    const response = await api.get("/api/Dashboard/village-house-distribution");
    return response.data;
  } catch (error) {
    console.error("Error fetching village-house distribution:", error);
    return error;
  }
};

export const getChildrenDemographics = async () => {
  try {
    const response = await api.get("/api/Dashboard/children-demographics");
    return response.data;
  } catch (error) {
    console.error("Error fetching children demographics:", error);
    return error;
  }
};

export const getPaymentMethodStatistics = async () => {
  try {
    const response = await api.get("/api/Dashboard/payment-methods");
    return response.data;
  } catch (error) {
    console.error("Error fetching payment method statistics:", error);
    return error;
  }
};

export const getAcademicPerformanceDistribution = async () => {
  try {
    const response = await api.get(
      "/api/Dashboard/academic-performance-distribution"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching academic performance distribution:", error);
    return error;
  }
};

export const getDonationTrends = async (year) => {
  try {
    const response = await api.get(`/api/Dashboard/donation-trends/${year}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching donation trends for year ${year}:`, error);
    return error;
  }
};

export const getChildTrends = async () => {
  try {
    const response = await api.get("/api/Dashboard/child-trends");
    return response.data;
  } catch (error) {
    console.error("Error fetching child trends:", error);
    return error;
  }
};