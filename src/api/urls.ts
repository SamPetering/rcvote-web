type Env = 'prod' | 'dev';
const APP_ENV = (import.meta.env.VITE_APP_ENV || 'dev') as Env;

export const API_URLS_MAP = {
  dev: `http://localhost:3000/api`,
  prod: `https://rcvote.app/api`,
} as const;

export const API_BASE_URL = API_URLS_MAP[APP_ENV];

export const CLIENT_URLS_MAP = {
  dev: `http://localhost:5173`,
  prod: `https://rcvote.app`,
} as const;

export const CLIENT_BASE_URL = CLIENT_URLS_MAP[APP_ENV];
