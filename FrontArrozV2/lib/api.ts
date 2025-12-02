import Constants from 'expo-constants';

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const extra = Constants.expoConfig?.extra ?? Constants.manifest?.extra ?? {};
const baseFromExtra = typeof extra?.apiUrl === 'string' && extra.apiUrl.length > 0 ? extra.apiUrl : undefined;

const API_BASE_URL = baseFromExtra ?? process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

type TokenResponse = {
  access_token: string;
  token_type: string;
};

const buildUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const prefix = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${prefix}${path.startsWith('/') ? path : `/${path}`}`;
};

const parseBody = async (response: Response) => {
  const text = await response.text();
  if (!text) {
    return undefined;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
};

export const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { body, headers, method = 'GET', signal } = options;
  const init: RequestInit = {
    method,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  };

  const response = await fetch(buildUrl(path), init);
  const data = await parseBody(response);

  if (!response.ok) {
    const message = (typeof data === 'object' && data && 'detail' in data && typeof (data as any).detail === 'string')
      ? (data as any).detail
      : response.statusText || 'Error en la petición';
    throw new ApiError(message, response.status, data);
  }

  return data as T;
};

export const signIn = (payload: { email: string; password: string }) =>
  request<TokenResponse>('/signin', { method: 'POST', body: payload });

export const signUp = (payload: { email: string; password: string }) =>
  request<TokenResponse>('/signup', { method: 'POST', body: payload });

export const requestPasswordReset = (payload: { email: string }) =>
  request<{ message: string }>('/password-reset/request', { method: 'POST', body: payload });

export const confirmPasswordReset = (payload: { email: string; code: string; new_password: string }) =>
  request<{ message: string }>('/password-reset/confirm', { method: 'POST', body: payload });
