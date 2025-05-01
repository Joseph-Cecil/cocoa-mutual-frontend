import apiClient from "@/utils/apiClient";

// Fetch user profile
export const fetchUserProfile = async () => {
    // const endpoint = userId ? `/profile/${userId}` : "/profile";
    const response = await apiClient.get("http://localhost:5000/api/user/profile");
    return response.data;
  };

export const fetchStaffData = async () => {
    try {
        const response = await apiClient.get("http://localhost:5000/api/user/staff-data");
        return response.data;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching staff data:", error);
        throw error;
    }
};

export const getInterest = async () => {
    try {
        const response = await apiClient.get("http://localhost:5000/api/user/get-interest");
        return response.data
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching get Interest:", error);
        throw error
    }
}
