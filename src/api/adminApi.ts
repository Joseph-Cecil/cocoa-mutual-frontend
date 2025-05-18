/* eslint-disable no-console */
import apiClient from "../utils/apiClient"; // Ensure this points to your API setup
const staffDataArray = [
  {
    "STAFF NUMBER": "12345",
    "STAFF NAME": "John Doe",
    "JANUARY": 200,
    "FEBRUARY": 300,
   
  },
];
export const uploadStaffData = async (staffDataArray: unknown[]) => {
  try {
    const response = await apiClient.post("http://localhost:5000/api/admin/upload-excel", staffDataArray);
    return response.data; // Return response from backend
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response ? error.response.data : error.message; // Handle errors
  }
};

export const setInterest = async (interest: number) => {
  try {
    const response = await apiClient.post("http://localhost:5000/api/admin/set-interest", {interest});
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
}



uploadStaffData(staffDataArray)
  .then((data) => console.log("Success:", data.message))
  .catch((error) => console.error("Error:", error));

// Fetch all users
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("http://localhost:5000/api/admin/users");
    console.log(response.data)
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching users", error);
    throw new Error("Failed to fetch users. Please try again.");
  }
};

export const deleteUser = async (userId: string | number) => {
  if (!userId) {
    // eslint-disable-next-line no-console
    console.error("Error: User ID is undefined");
    return;
  }

  const response = await apiClient.delete(`http://localhost:5000/api/admin/user/${userId}`);
  return response.data;
};

export const getStaffData = async () => {
  try {
    const response = await apiClient.get("http://localhost:5000/api/admin/get-staff-data");
    console.log("Contribution Data:", response.data);

    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching users", error);
    throw new Error("Failed to fetch users. Please try again.");
  }
};


