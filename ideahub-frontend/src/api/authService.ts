import api from './axiosClient';
import Cookies from 'js-cookie';
import type { AuthResponse, User } from './types';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // Бэкенд возвращает JWT токен (строка) при успешном входе
    const response = await api.post('/auth/login', { email, password });
    
    // Проверяем, что ответ успешен и содержит токен
    if (response.status === 200 && typeof response.data === 'string') {
      const token = response.data; // JWT токен
      
      // Кладём токен в cookie, чтобы axios подхватил его
      Cookies.set('token', token, { sameSite: 'lax' });
      
      try {
        // Получаем данные пользователя через /api/auth/me
        const userResponse = await api.get('/auth/me');
        const userData = userResponse.data;
        
        return {
          token: token,
          user: {
            id: userData.id,
            username: userData.username,
            email: userData.email,
          },
        };
      } catch (err) {
        // Если не удалось получить пользователя, очищаем cookie
        Cookies.remove('token');
        throw new Error('Не удалось получить данные пользователя');
      }
    }
    
    throw new Error('Неверный email или пароль');
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data || error.response.statusText || 'Ошибка входа';
      throw new Error(message);
    }
    throw error;
  }
};

export const register = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/register', { username, email, password });
    const userData = response.data;
    const loginResponse = await api.post('/auth/login', { email, password });
    const token = loginResponse.data; // JWT токен
    Cookies.set('token', token, { sameSite: 'lax' });
    
    return {
      token: token,
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
      },
    };
  } catch (error: any) {
    // Обрабатываем ошибки от бэкенда
    if (error.response) {
      const message = error.response.data || error.response.statusText || 'Ошибка регистрации';
      throw new Error(message);
    }
    throw error;
  }
};

// Получить текущего пользователя
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Обновить текущего пользователя
export const updateCurrentUser = async (data: { username: string; email: string }): Promise<User> => {
  const response = await api.put('/auth/me', data);
  return response.data;
};