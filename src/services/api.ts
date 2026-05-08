import type { ErrorResponse } from '../types/api';

const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/+$/, '');

export function apiUrl(path: string): string {
  return API_BASE ? `${API_BASE}${path}` : path;
}

export async function fetchApi<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(apiUrl(path), init);
  const data = (await response.json().catch(() => ({}))) as TResponse | ErrorResponse;

  if (!response.ok) {
    const errorData = data as ErrorResponse;
    throw new Error(errorData.error || errorData.message || `Request failed with ${response.status}`);
  }

  return data as TResponse;
}
