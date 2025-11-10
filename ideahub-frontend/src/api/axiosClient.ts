import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
  headers: { 'Content-Type': 'application/json' },
});

// Перехватчик запросов - добавляет токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Перехватчик ответов - обрабатывает ошибки
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      console.error('Ошибка сети. Убедитесь, что бэкенд запущен и CORS настроен правильно.');
      error.message = 'Не удалось подключиться к серверу. Проверьте, что бэкенд запущен.';
    }
    
    if (error.response?.status === 401) {
      Cookies.remove('token');
    }
    
    return Promise.reject(error);
  }
);

export default api;