import axios from "axios";

const baseURL = "https://soschildrenvillage.azurewebsites.net/";

const api = axios.create({
  baseURL: baseURL,
});

// Children
// export const getChildWithImages = async (showDeleted = false) => {
//   try {
//     const endpoint = showDeleted
//       ? "/api/Children/GetAllChildIsDelete"
//       : "/api/Children/GetAllChildWithImg";
//     const response = await api.get(endpoint);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching children data:", error);
//     return [];
//   }
// };
export const getChildWithImages = async (showDeleted = false, search = "") => {
  try {
    let endpoint = showDeleted 
      ? "/api/Children/GetAllChildIsDelete" 
      : "/api/Children/GetAllChildWithImg";

    // Nếu có tham số tìm kiếm, gọi API Search
    if (search) {
      endpoint = `/api/Children/SearchChildren?searchTerm=${encodeURIComponent(search)}`;
    }

    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching User Account:", error);
    throw error;
  }
};

export const getChildDetail = async (childId) => {
  try {
    // Ensure childId is a string
    // Extract the id if it's an object because when debug it's will show as object like this https://soschildrenvillage.azurewebsites.net/api/Children/GetChildDetails/[object%20Object]
    if (typeof childId === 'object') {    
      childId = childId.id;
    }
    const response = await api.get(`/api/Children/GetChildDetails/${childId}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching children details:", error);
    throw error;
  }
};

// Houses
// export const getHouseWithImages = async (showDeleted = false) => {
//   try {
//     const endpoint = showDeleted
//       ? "/api/Houses/GetAllHousesIsDelete"
//       : "/api/Houses/GetAllHousesWithImg";
//     const response = await api.get(endpoint);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching Houses data:", error);
//     return [];
//   }
// };
export const getHouseWithImages = async (showDeleted = false, search = "") => {
  try {
    let endpoint = showDeleted 
      ? "/api/Houses/GetAllHousesIsDelete" 
      : "/api/Houses/GetAllHousesWithImg";

    // Nếu có tham số tìm kiếm, gọi API Search
    if (search) {
      endpoint = `/api/Houses/SearchHouse?searchTerm=${encodeURIComponent(search)}`;
    }

    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching User Account:", error);
    throw error;
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
// export const getVillagesWithImages = async (showDeleted = false) => {
//   try {
//     const endpoint = showDeleted
//       ? "/api/Village/GetAllVillageIsDelete"
//       : "/api/Village/GetAllVillageWithImg";
//     const response = await api.get(endpoint);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching Villages with image:", error);
//     throw error;
//   }
// };
export const getVillagesWithImages = async (showDeleted = false, search = "") => {
  try {
    let endpoint = showDeleted 
      ? "/api/Village/GetAllVillageIsDelete" 
      : "/api/Village/GetAllVillageWithImg";

    // Nếu có tham số tìm kiếm, gọi API Search
    if (search) {
      endpoint = `/api/Village/SearchVillage?searchTerm=${encodeURIComponent(search)}`;
    }

    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching User Account:", error);
    throw error;
  }
};

export const getVillageDetail = async (villageId) => {
  try {
    const response = await api.get(`/api/Village/GetVillageDetails/${villageId}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching village details:", error);
    throw error;
  }
};

//Events
// export const getEventsWithImages = async (showDeleted = false) => {
//   try {
//     const endpoint = showDeleted
//       ? "/api/Event/GetAllEventsIsDelete"
//       : "/api/Event/GetAllEventsArray";
//     const response = await api.get(endpoint);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching Events with image:", error);
//     throw error;
//   }
// };
export const getEventsWithImages = async (showDeleted = false, search = "") => {
  try {
    let endpoint = showDeleted 
      ? "/api/Event/GetAllEventsIsDelete" 
      : "/api/Event/GetAllEventsArray";

    // Nếu có tham số tìm kiếm, gọi API Search
    if (search) {
      endpoint = `/api/Event/SearchArrayEvent?searchTerm=${encodeURIComponent(search)}`;
    }

    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching User Account:", error);
    throw error;
  }
};

//Academic Report
// export const getAcademicReport = async () => {
//   try {
//     const response = await api.get("/api/AcademicReport");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching children:", error);
//     throw error;
//   }
// };

export const getAcademicReportWithImages = async (showDeleted = false) => {
  try {
    const endpoint = showDeleted
      ? "/api/AcademicReport/GetAllAcademicReportIsDelete"
      : "/api/AcademicReport/GetAllAcademicReportWithImg";
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching Academic Report with image:", error);
    throw error;
  }
};

//Health Report
export const getHealthReportWithImages = async (showDeleted = false) => {
  try {
    const endpoint = showDeleted
      ? "/api/HealthReport/GetAllHealthReportIsDelete"
      : "/api/HealthReport/GetAllHealthReportWithImg";
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching Academic Report with image:", error);
    throw error;
  }
};

//User Accounts
export const getAccount = async (showDeleted = false, search = "") => {
  try {
    let endpoint = showDeleted 
      ? "/api/UserAccount/GetAllUserIsDelete" 
      : "/api/UserAccount/GetAllUserArray";

    // Nếu có tham số tìm kiếm, gọi API Search
    if (search) {
      endpoint = `/api/UserAccount/SearchArray?searchTerm=${encodeURIComponent(search)}`;
    }

    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching User Account:", error);
    throw error;
  }
};

// export const getAccount = async (showDeleted = false, search = "") => {
//   try {
//     let endpoint;
//     if (search) {
//       endpoint = `/api/UserAccount/Search?SearchTerm=${encodeURIComponent(search)}`;
//     } else {
//       endpoint = showDeleted
//         ? "/api/UserAccount/GetAllUserIsDelete"
//         : "/api/UserAccount/GetAllUserArray";
//     }

//     console.log("Calling endpoint:", endpoint);

//     const response = await api.get(endpoint);
//     console.log("Response data:", response.data);

//     return response.data?.$values || [];
//   } catch (error) {
//     console.error("Error fetching User Account:", error.response || error.message);
//     throw error;
//   }
// };

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
      ? "/api/School/GetAllSchoolsIsDeleted"
      : "/api/School/GetAllSchoolWithImg";
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching Schools data:", error);
    return [];
  }
};

export const getSchoolDetail = async (schoolId) => {
  try {
    // Ensure childId is a string
    // Extract the id if it's an object because when debug it's will show as object like this https://soschildrenvillage.azurewebsites.net/api/Children/GetChildDetails/[object%20Object]
    // if (typeof schoolId === 'object') {    
    //   schoolId = schoolId.id;
    // }
    const response = await api.get(`/api/School/GetSchoolDetails/${schoolId}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching School details:", error);
    throw error;
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
      ? "/api/Activity/GetAllActivityIsDelete"
      : "/api/Activity/GetAllActivityWithImg";
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
      ? "/api/Inventory/GetAllInventoryIsDelete"
      : "/api/Inventory/GetAllInventoryWithImg";
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching Inventory with image:", error);
    throw error;
  }
};

export default api;
