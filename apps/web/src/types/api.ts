export interface ApiClientOptionsI {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  body?: Record<string, unknown> | FormData | null;
  credentials?: RequestCredentials; // 'include' | 'same-origin' | 'omit'
}
