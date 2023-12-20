export const apiBaseUrl =
  import.meta.env.MODE === 'development'
    ? '/api/v1'
    : `${import.meta.env.VITE_API_BASE}/api/v1`;
