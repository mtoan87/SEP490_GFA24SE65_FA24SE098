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

export const getEfficiencyByMonth = async () => {
  try {
    const response = await api.get("/api/Dashboard/efficiency-by-month");
    return response.data;
  } catch (error) {
    console.error("Error fetching efficiency by month:", error);
    return error;
  }
};


export const getBudgetUtilizationPercentage = async () => {
  try {
    const response = await api.get("/api/Dashboard/budget-utilization");
    return response.data;
  } catch (error) {
    console.error("Error fetching budget utilization percentage:", error);
    return error;
  }
};


export const getCostPerChild = async () => {
  try {
    const response = await api.get("/api/Dashboard/cost-per-child");
    return response.data;
  } catch (error) {
    console.error("Error fetching cost per child:", error);
    return error;
  }
};

/**
 * Lấy dữ liệu phân bổ ví (wallet distribution) theo userAccountId
 * @param {string} userAccountId
 * @returns {Promise<Object>} 
 */
export const getWalletDistribution = async (userAccountId) => {
  try {
    const response = await api.get(`/api/Dashboard/wallet-distribution`, {
      params: { userAccountId },
    });
    if (response.data.success) {
      return response.data.data;
    } else {
      console.error("API Error:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching wallet distribution data:", error);
    return null;
  }
};

/**
 * Lấy dữ liệu xu hướng đặt chỗ (booking trends) theo timeFrame
 * @param {string} timeFrame - Khoảng thời gian cần lấy dữ liệu (week, month, year)
 * @returns {Promise<Object>}
 */
export const getBookingTrends = async (timeFrame) => {
  try {
    const response = await api.get(`/api/Dashboard/booking-trends/${timeFrame}`);
    if (response.data.success) {
      return response.data.data;
    } else {
      console.error("API Error:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching booking trends data:", error);
    return null;
  }
};

/**
 * Lấy dữ liệu thu chi (income-expense) theo năm
 * @param {number} year - Năm cần lấy dữ liệu
 * @returns {Promise<Object>}
 */
export const getIncomeExpenseComparison = async (year) => {
  try {
    const response = await api.get(`/api/Dashboard/income-expense/${year}`);
    if (response.data.success) {
      return response.data.data;
    } else {
      console.error("API Error:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching income-expense data:", error);
    return null;
  }
};