export const getApiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  const prodFallbackUrl = "https://ecommerce-0f9b.onrender.com";

  // 1. Browser environment execution
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocal =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.endsWith(".local");

    if (isLocal) {
      if (envUrl && (envUrl.includes("localhost") || envUrl.includes("127.0.0.1"))) {
        return `${envUrl.replace(/\/$/, "")}${cleanPath}`;
      }
      return `http://${hostname}:8000${cleanPath}`;
    }

    // Live custom domain point or remote server
    if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
      return `${envUrl.replace(/\/$/, "")}${cleanPath}`;
    }
    return `${prodFallbackUrl}${cleanPath}`;
  }

  // 2. SSR / Node environment execution
  if (envUrl && (process.env.NODE_ENV === "production" || (!envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")))) {
    return `${envUrl.replace(/\/$/, "")}${cleanPath}`;
  }

  if (process.env.NODE_ENV === "production") {
    return `${prodFallbackUrl}${cleanPath}`;
  }

  return `http://localhost:8000${cleanPath}`;
};
