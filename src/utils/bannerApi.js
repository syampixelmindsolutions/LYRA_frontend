const BANNER_API_BASE = "http://localhost:6055/api/banners";

export const bannerApiFetch = async (path, options = {}) => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const token = user?.token;

  const res = await fetch(`${BANNER_API_BASE}${path}`, {
    method: options.method || "GET",
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || `HTTP ${res.status}`);
  }

  return res.json();
};

// // src/utils/bannerApi.js
// const BANNER_API_BASE = 'http://localhost:6055/api/admin';

// export const bannerApiFetch = async (path, options = {}) => {
//   const user = JSON.parse(sessionStorage.getItem("user") || "{}");
//   const token = user.token || "";

//   const res = await fetch(`${BANNER_API_BASE}${path}`, {
//     method: options.method || "GET",
//     body: options.body ? JSON.stringify(options.body) : undefined,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: token ? `Bearer ${token}` : "",
//       ...(options.headers || {}),
//     },
//   });

//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     console.error('Server Error:', err); // Log the server error  
//     throw new Error(err.message || err.error || `HTTP ${res.status}`);
//   }

//   return res.json();
// };



// const API_BASE = '/api/banners';

// export const bannerApiFetch = async (path, options = {}) => {
//   const user = JSON.parse(sessionStorage.getItem('user') || '{}');
//   const token = user.token || '';

//   const res = await fetch(`${API_BASE}${path}`, {
//     ...options,
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: token ? `Bearer ${token}` : '',
//       ...(options.headers || {}),
//     },
//   });

//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.error || err.message || `HTTP ${res.status}`);
//   }

//   return res.json();
// };

// // Get all banners
// export const fetchBanners = async () => {
//   return bannerApiFetch('');
// };

// // Get active banners
// export const fetchActiveBanners = async () => {
//   return bannerApiFetch('/active');
// };

// // Create banner
// export const createBanner = async (bannerData) => {
//   return bannerApiFetch('', {
//     method: 'POST',
//     body: JSON.stringify(bannerData),
//   });
// };

// // Update banner
// export const updateBanner = async (id, bannerData) => {
//   return bannerApiFetch(`/${id}`, {
//     method: 'PUT',
//     body: JSON.stringify(bannerData),
//   });
// };

// // Delete banner
// export const deleteBanner = async (id) => {
//   return bannerApiFetch(`/${id}`, {
//     method: 'DELETE',
//   });
// };