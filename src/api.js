import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Override headers for multipart/form-data requests
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // Let the browser set the Content-Type header for form-data
    delete config.headers['Content-Type'];
  }
  return config;
});

// ==========================================
// HAIR ANALYSIS ENDPOINTS
// ==========================================

export const uploadHairPhoto = async (imageFile) => {
  // We must use FormData to send files (standard for file uploads)
  const formData = new FormData();
  formData.append('file', imageFile);

  try {
    // Note: Content-Type header is automatically handled by the interceptor above
    const response = await api.post('/upload', formData);
    return {
      success: true,
      sessionId: response.data.session_id,
      analysis: response.data.analysis,
      message: response.data.model_used
    };
  } catch (error) {
    console.error("Upload failed:", error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to upload photo'
    };
  }
};

export const getCarePlan = async (sessionId) => {
  try {
    const response = await api.get(`/plan?session_id=${sessionId}`);
    return {
      success: true,
      data: response.data.care_plan,
      hairType: response.data.hair_type
    };
  } catch (error) {
    console.error("Failed to fetch plan:", error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to get care plan'
    };
  }
};

export const getHistory = async (sessionId) => {
  try {
    const response = await api.get(`/history?session_id=${sessionId}`);
    return {
      success: true,
      logs: response.data.logs || [],
      totalLogs: response.data.logs?.length || 0,
      hairType: response.data.hair_type || null
    };
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to get history'
    };
  }
};

export default api;
