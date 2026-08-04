// Single source of truth for where the backend lives, so the REST client
// and the Socket.io client can never point at different servers again.
//
// Dev: goes through Vite's proxy (see vite.config.js) to the local backend.
// Prod: hits the deployed API directly.
export const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : "https://api.royalmatrimony.org/api";

export const SOCKET_URL = import.meta.env.DEV
  ? "/"
  : "https://api.royalmatrimony.org";

// Base for uploaded files (profile photos, blog covers, etc.), which the
// backend serves statically at /uploads on the same host as the API.
export const IMAGE_BASE_URL = import.meta.env.DEV
  ? ""
  : "https://api.royalmatrimony.org";
