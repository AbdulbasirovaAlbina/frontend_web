import api from './axiosClient';
import type { Comment } from './types';

export const getComments = (ideaId: number): Promise<Comment[]> =>
  api.get(`/ideas/${ideaId}/comments`).then(res => res.data);

export const addComment = (ideaId: number, text: string): Promise<Comment> =>
  api.post(`/ideas/${ideaId}/comments`, { text }).then(res => res.data);