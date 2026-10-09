export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://school-management-backend-w500.onrender.com";

// Zero-network inline SVG avatar
export const DEFAULT_AVATAR =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%232e7d32"/><circle cx="50" cy="38" r="20" fill="%23ffffff"/><path d="M18 84 c0 -18 14 -32 32 -32 s32 14 32 32 Z" fill="%23ffffff"/></svg>';

export const getPhotoUrl = (photoUrl) => {
  if (!photoUrl || typeof photoUrl !== "string") return DEFAULT_AVATAR;
  const trimmed = photoUrl.trim();
  if (
    !trimmed ||
    trimmed === "null" ||
    trimmed === "undefined" ||
    trimmed.includes("via.placeholder.com")
  ) {
    return DEFAULT_AVATAR;
  }
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }
  const cleanPath = trimmed.replace(/^\/?(uploads\/)?/, "");
  return `${API_BASE_URL}/uploads/${cleanPath}`;
};

export default API_BASE_URL;
