import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

export const getStudentProfile = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student profile:", error.message);
    throw error;
  }
};

export const updateStudentProfile = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating student profile:", error.message);
    throw error;
  }
};

export const createStudent = async (studentData) => {
  try {
    const response = await axios.post(API_URL, { ...studentData, role: "student" });
    return response.data;
  } catch (error) {
    console.error("Error creating student:", error.message);
    throw error;
  }
};

export const getAllStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}?role=student`);
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error.message);
    throw error;
  }
};