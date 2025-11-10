import api from './axiosClient';
import type { Idea } from './types';

export const getIdeas = (params?: { sort?: string }): Promise<Idea[]> =>
  api.get('/ideas', { params }).then(res => res.data);

export const getIdea = (id: number): Promise<Idea> =>
  api.get(`/ideas/${id}`).then(res => res.data);

export const createIdea = (data: { title: string; description: string }): Promise<Idea> =>
  api.post('/ideas', data).then(res => res.data);

export const updateIdea = (id: number, data: { title?: string; description?: string }): Promise<Idea> =>
  api.put(`/ideas/${id}`, data).then(res => res.data);

export const deleteIdea = (id: number): Promise<void> =>
  api.delete(`/ideas/${id}`).then(() => {});

export const rateIdea = (ideaId: number, data: { novelty: number; feasibility: number }): Promise<Idea> =>
  api.post(`/ideas/${ideaId}/rate`, data).then(res => res.data);

export const hasUserRated = (ideaId: number): Promise<boolean> =>
  api.get(`/ideas/${ideaId}/has-rated`).then(res => res.data);