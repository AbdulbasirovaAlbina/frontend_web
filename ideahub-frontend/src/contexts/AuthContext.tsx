import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../api/types';
import { getCurrentUser } from '../api/authService';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          // Получаем данные пользователя через /api/auth/me
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (err) {
          // Если токен невалидный или пользователь не найден, удаляем токен
          console.warn('Не удалось загрузить пользователя, требуется повторный вход');
          Cookies.remove('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = (token: string, userData: User) => {
    Cookies.set('token', token, { sameSite: 'lax' });
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};