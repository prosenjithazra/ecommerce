export const getApiUrl = (path: string): string => {
  if (process.env.NODE_ENV === "production") {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://ecommerce-0f9b.onrender.com";
    return `${baseUrl.replace(/\/$/, "")}${path}`;
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    return `http://${hostname}:8000${path}`;
  }
  return `http://127.0.0.1:8000${path}`;
};
