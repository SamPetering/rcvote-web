import { API_BASE_URL } from '@/api/urls';
import axios, { AxiosRequestConfig } from 'axios';

async function makeRequest<R>(config: AxiosRequestConfig): Promise<R> {
  const headers: AxiosRequestConfig['headers'] = {
    'Content-Type': 'application/json',
  };

  const response = await axios.request<R>({
    baseURL: API_BASE_URL,
    ...config,
    headers,
    withCredentials: true,
  });

  return response.data;
}

export function useRequest() {
  return async <R = void>(config: AxiosRequestConfig) => {
    try {
      const res = await makeRequest<R>(config);
      return res;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        try {
          await makeRequest({
            method: 'GET',
            url: '/users/me/refresh',
          });
          const res = await makeRequest<R>(config);
          return res;
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          throw refreshError;
        }
      }
      throw error;
    }
  };
}
