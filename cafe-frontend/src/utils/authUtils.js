import { jwtDecode } from "jwt-decode";

export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const isAdmin = () => {
  const token = getToken();
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return decoded.roles && decoded.roles.some(role => role.authority === "ROLE_ADMIN");
  } catch (err) {
    console.error("Lỗi giải mã token:", err);
    return false;
  }
};