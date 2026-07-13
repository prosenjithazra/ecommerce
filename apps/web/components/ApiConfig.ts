export const getApiUrl = (path: string): string => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    return `http://${hostname}:8000${path}`;
  }
  return `http://127.0.0.1:8000${path}`;
};
