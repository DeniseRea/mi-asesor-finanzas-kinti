const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const TOKEN_KEY = 'kinti_token';
const DEFAULT_TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  constructor(message: string, public readonly status: number | null, public readonly code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {};
  if (!(options?.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options?.headers) Object.assign(headers, options.headers);

  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  const signal = options?.signal ?? controller.signal;

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers, signal });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string | string[]; code?: string } | null;
      const rawMessage = body?.message ?? `API Error: ${response.status}`;
      if (response.status === 401 && token && typeof window !== 'undefined') window.dispatchEvent(new Event('kinti:unauthorized'));
      throw new ApiError(Array.isArray(rawMessage) ? rawMessage.join(', ') : rawMessage, response.status, body?.code);
    }
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') throw new ApiError('REQUEST_TIMEOUT', 408, 'REQUEST_TIMEOUT');
    throw new ApiError('NETWORK_ERROR', 0, 'NETWORK_ERROR');
  } finally {
    globalThis.clearTimeout(timeout);
  }
}
