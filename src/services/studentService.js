import api from "./api";

export const getStudentProfile = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student profile:", error.message);
    throw error;
  }
};

export const updateStudentProfile = async (id, updatedData) => {
  try {
    const response = await api.put(`/users/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating student profile:", error.message);
    throw error;
  }
};

export const createStudent = async (studentData) => {
  try {
    const response = await api.post("/users", { ...studentData, role: "student" });
    return response.data;
  } catch (error) {
    console.error("Error creating student:", error.message);
    throw error;
  }
};

export const getAllStudents = async () => {
  try {
    const response = await api.get("/users?role=student");
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error.message);
    throw error;
  }
};