// React/TypeScript API client - third different approach!
// TODO: This should be consistent with backend implementations
// FIXME: Using fetch instead of axios to avoid missing dependency

// Different configuration again
const API_CONFIG = {
  baseURL: 'http://localhost:3001/api',
  timeout: 8000, // Yet another different timeout!
  headers: {
    'Content-Type': 'application/json',
  }
};

const PYTHON_API_CONFIG = {
  baseURL: 'http://localhost:5000', // Python service config
  timeout: 6000, // Different timeout
};

// Different error handling approach
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Token management - different from backend
let authToken: string | null = null;

export const setAuthToken = (token: string): void => {
  authToken = token;
};

export const clearAuthToken = (): void => {
  authToken = null;
};

// Generic request wrapper using fetch - different signature than Python
async function makeApiRequest<T>(
  baseURL: string,
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<ApiResponse<T>> {
  try {
    const url = `${baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Request failed',
    };
  }
}

// Express API methods - different from Python client
export const expressApiClient = {
  // User authentication
  login: async (username: string, password: string): Promise<ApiResponse<any>> => {
    return makeApiRequest(API_CONFIG.baseURL, '/login', 'POST', { username, password });
  },

  register: async (userData: any): Promise<ApiResponse<any>> => {
    return makeApiRequest(API_CONFIG.baseURL, '/register', 'POST', userData);
  },

  // Products
  getProducts: async (): Promise<ApiResponse<any[]>> => {
    return makeApiRequest(API_CONFIG.baseURL, '/products');
  },

  createProduct: async (product: any): Promise<ApiResponse<any>> => {
    return makeApiRequest(API_CONFIG.baseURL, '/products', 'POST', product);
  },

  // Orders
  createOrder: async (orderData: any): Promise<ApiResponse<any>> => {
    return makeApiRequest(API_CONFIG.baseURL, '/orders', 'POST', orderData);
  },

  getUserOrders: async (): Promise<ApiResponse<any[]>> => {
    return makeApiRequest(API_CONFIG.baseURL, '/orders');
  },
};

// Python API methods - different naming convention
export const pythonApiClient = {
  // Notifications
  getNotifications: async (userId: string): Promise<ApiResponse<any[]>> => {
    return makeApiRequest(PYTHON_API_CONFIG.baseURL, `/notifications/${userId}`);
  },

  createNotification: async (notification: any): Promise<ApiResponse<any>> => {
    return makeApiRequest(PYTHON_API_CONFIG.baseURL, '/notifications', 'POST', notification);
  },

  markNotificationRead: async (notificationId: string): Promise<ApiResponse<any>> => {
    return makeApiRequest(PYTHON_API_CONFIG.baseURL, `/notifications/${notificationId}/read`, 'PUT');
  },

  // Analytics
  trackEvent: async (eventData: any): Promise<ApiResponse<any>> => {
    return makeApiRequest(PYTHON_API_CONFIG.baseURL, '/analytics/track', 'POST', eventData);
  },

  getUserStats: async (userId: string): Promise<ApiResponse<any>> => {
    return makeApiRequest(PYTHON_API_CONFIG.baseURL, `/analytics/stats/${userId}`);
  },
};

// Utility functions - missing from other implementations
export const apiUtils = {
  isAuthenticated: (): boolean => {
    return !!authToken;
  },

  handleAuthError: (): void => {
    clearAuthToken();
    // Should redirect to login, but this varies by implementation
    window.location.href = '/login';
  },

  // Local storage helpers - should be consistent across services
  saveToken: (token: string): void => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
  },

  loadToken: (): string | null => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
    return token;
  },

  removeToken: (): void => {
    localStorage.removeItem('authToken');
    clearAuthToken();
  },
};