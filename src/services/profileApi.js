import API from "./axios";

/**
 * GET current user's profile
 */
export const getMyProfile = async () => {
  try {
    const response = await API.get("/profile/me");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error fetching profile";
  }
};

/**
 * UPDATE profile
 */
export const updateMyProfile = async (profileData) => {
  try {
    const response = await API.put("/profile", profileData); // ✅ FIXED
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error updating profile";
  }
};

/**
 * UPLOAD photos
 */
export const uploadPhotos = async (formData) => {
  try {
    const response = await API.post("/profile/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Upload failed";
  }
};

/**
 * DELETE photo
 */
export const deletePhoto = async (photoUrl) => {
  try {
    const response = await API.delete("/profile/photo", {
      data: { photoUrl },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Delete failed";
  }
};

/**
 * SET PROFILE PIC
 */
export const setProfilePic = async (photoUrl) => {
  try {
    const response = await API.put("/profile/profile-pic", {
      photoUrl,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to set profile pic";
  }
};
