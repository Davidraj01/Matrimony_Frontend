import API from "./axios";

const unwrap = (promise) =>
  promise.then((res) => res.data).catch((err) => {
    throw err.response?.data || { message: "Something went wrong" };
  });

// DASHBOARD
export const getDashboard = () => unwrap(API.get("/admin/dashboard"));

// USERS
export const getUsers = (params) => unwrap(API.get("/admin/users", { params }));
export const getUser = (id) => unwrap(API.get(`/admin/user/${id}`));
export const blockUser = (id, reason) =>
  unwrap(API.put(`/admin/block/${id}`, { reason }));
export const unblockUser = (id) => unwrap(API.put(`/admin/unblock/${id}`));
export const forceLogoutUser = (id) =>
  unwrap(API.put(`/admin/user/${id}/force-logout`));
export const deleteUser = (id) => unwrap(API.delete(`/admin/user/${id}`));

// PROFILES
export const getProfiles = (params) =>
  unwrap(API.get("/admin/profiles", { params }));
export const getProfile = (id) => unwrap(API.get(`/admin/profile/${id}`));
export const updateProfile = (id, data) =>
  unwrap(API.put(`/admin/profile/${id}`, data));
export const deleteProfile = (id) => unwrap(API.delete(`/admin/profile/${id}`));
export const toggleFeaturedProfile = (id) =>
  unwrap(API.put(`/admin/profile/${id}/feature`));

// PLANS & SUBSCRIPTIONS
export const getPlans = () => unwrap(API.get("/admin/plans"));
export const updatePlan = (id, data) =>
  unwrap(API.put(`/admin/plans/${id}`, data));
export const setUserSubscription = (id, data) =>
  unwrap(API.put(`/admin/user/${id}/subscription`, data));

// BILLING
export const getBilling = (params) =>
  unwrap(API.get("/admin/billing", { params }));
export const refundBilling = (id) =>
  unwrap(API.post(`/admin/billing/${id}/refund`));

// REPORTS
export const getReports = (params) =>
  unwrap(API.get("/admin/reports", { params }));
export const updateReportStatus = (id, data) =>
  unwrap(API.put(`/admin/reports/${id}`, data));

// SUCCESS STORIES
export const getStories = () => unwrap(API.get("/admin/stories"));
export const createStory = (formData) =>
  unwrap(API.post("/admin/stories", formData));
export const updateStory = (id, formData) =>
  unwrap(API.put(`/admin/stories/${id}`, formData));
export const deleteStory = (id) => unwrap(API.delete(`/admin/stories/${id}`));

// BLOGS
export const getBlogs = (params) => unwrap(API.get("/admin/blogs", { params }));
export const createBlog = (formData) => unwrap(API.post("/admin/blogs", formData));
export const updateBlog = (id, formData) =>
  unwrap(API.put(`/admin/blogs/${id}`, formData));
export const deleteBlog = (id) => unwrap(API.delete(`/admin/blogs/${id}`));

// NOTIFICATIONS
export const getNotifications = () => unwrap(API.get("/admin/notifications"));
export const sendNotification = (data) =>
  unwrap(API.post("/admin/notifications", data));
export const sendExpiryReminders = () =>
  unwrap(API.post("/admin/notifications/expiry-reminder"));

// SETTINGS
export const getSettings = () => unwrap(API.get("/admin/settings"));
export const updateSettings = (data) => unwrap(API.put("/admin/settings", data));
export const updateMyAccount = (data) => unwrap(API.put("/admin/me", data));

// Resolve an uploaded file path (e.g. "/uploads/x.jpg") to a full URL.
export const fileUrl = (path) =>
  path ? `${API.defaults.baseURL.replace(/\/api$/, "")}${path}` : "";
