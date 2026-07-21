export const getApiUrl = (path: string): string => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168.") || hostname.endsWith(".local")) {
      return `http://${hostname}:8000${path}`;
    }
  }

  if (process.env.NODE_ENV === "production") {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://ecommerce-0f9b.onrender.com";
    return `${baseUrl.replace(/\/$/, "")}${path}`;
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    return `http://${hostname}:8000${path}`;
  }
  return `http://localhost:8000${path}`;
};
