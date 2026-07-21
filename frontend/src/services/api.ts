import axios, { AxiosInstance } from 'axios';

// Configuration interface for the widget
export interface WidgetConfig {
  apiUrl: string;
  apiKey?: string;
}

// Global configuration holder
let appConfig: WidgetConfig = {
  apiUrl: '',
};

/**
 * Initializes the API service with the provided configuration.
 * This should be called by the widget entry point before any API calls.
 * @param config - The configuration object containing the apiUrl.
 */
export const initializeApiConfig = (config: WidgetConfig): void => {
  if (!config.apiUrl) {
    console.error('API URL is required for widget initialization.');
    return;
  }
  appConfig = { ...config };
};

// Create an axios instance with dynamic configuration
const apiClient: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject the dynamic base URL
apiClient.interceptors.request.use((config) => {
  if (!appConfig.apiUrl) {
    return Promise.reject(new Error('API URL is not configured. Please initialize the widget.'));
  }
  config.baseURL = appConfig.apiUrl;
  
  // If an API key is provided, add it to the headers
  if (appConfig.apiKey) {
    config.headers['X-API-Key'] = appConfig.apiKey;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * Sends a message to the chatbot backend.
 * @param message - The user's message text.
 * @param sessionId - Optional session identifier for conversation context.
 * @returns The response data from the server.
 */
export const sendMessage = async (message: string, sessionId?: string): Promise<any> => {
  try {
    const response = await apiClient.post('/chat', {
      message,
      sessionId,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export default apiClient;