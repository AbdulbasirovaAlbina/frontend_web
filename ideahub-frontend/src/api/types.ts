// === ПОЛЬЗОВАТЕЛЬ ===
export interface User {
  id: number;
  username: string;
  email: string;
}

// === ИДЕЯ ===
export interface Idea {
  id: number;
  title: string;
  description: string;
  author: User; 
  avgNovelty: number;
  avgFeasibility: number;
  createdAt: string; 
  likes?: number;
  commentsCount?: number;
  trend?: 'up' | 'down' | 'neutral';
  averageRating?: number;
}

// === ОЦЕНКА ===
export interface Rating {
  ideaId: number;
  userId: number;
  novelty: number;
  feasibility: number;
}

// === КОММЕНТАРИЙ ===
export interface Comment {
  id: number;
  ideaId: number;
  author: User; 
  text: string;
  createdAt: string; 
}

// === АВТОРИЗАЦИЯ ===
export interface AuthResponse {
  token: string;
  user: User;
}