import api from './api';
import { EventItem, EventCategory } from '../types';

export interface EventQueryParams {
  page?: number;
  category?: number;
  search?: string;
  is_online?: boolean;
  from?: string;
  to?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  links?: any;
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

export const eventService = {
  getPublicEvents: async (params?: EventQueryParams): Promise<PaginatedResponse<EventItem>> => {
    return api.get('/events/public', { params });
  },

  getCategories: async (): Promise<{ data: EventCategory[] }> => {
    return api.get('/categories');
  },

  getEventById: async (id: number | string): Promise<{ data: EventItem }> => {
    return api.get(`/events/public/${id}`);
  },

  getOrganizerEvents: async (page = 1): Promise<PaginatedResponse<EventItem>> => {
    return api.get('/events', { params: { page } });
  },

  createEvent: async (payload: Partial<EventItem>): Promise<{ data: EventItem }> => {
    return api.post('/events', payload);
  },

  updateEvent: async (id: number, payload: Partial<EventItem>): Promise<{ data: EventItem }> => {
    return api.put(`/events/${id}`, payload);
  },

  publishEvent: async (id: number): Promise<{ data: EventItem }> => {
    return api.post(`/events/${id}/publish`);
  },

  unpublishEvent: async (id: number): Promise<{ data: EventItem }> => {
    return api.post(`/events/${id}/unpublish`);
  },

  cancelEvent: async (id: number): Promise<{ data: EventItem }> => {
    return api.post(`/events/${id}/cancel`);
  },

  archiveEvent: async (id: number): Promise<{ data: EventItem }> => {
    return api.post(`/events/${id}/archive`);
  },

  deleteEvent: async (id: number): Promise<{ success: boolean; message: string }> => {
    return api.delete(`/events/${id}`);
  },

  getAnalytics: async (): Promise<{ data: any }> => {
    return api.get('/analytics/dashboard');
  },

  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  exportAttendees: async (eventId: number, eventName: string) => {
    const response = await api.get(`/events/${eventId}/export-attendees`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response as any]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `attendees_${eventName}_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
