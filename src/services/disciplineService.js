import api from "./api";

export const fetchStudentDiscipline = async (admissionNumber) => {
  try {
    const res = await api.get(`/discipline/${admissionNumber}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("Error fetching discipline records:", err.message);
    throw err;
  }
};

export const addDisciplineRecord = async ({
  admissionNumber,
  comment,
  type = "Minor",
  severity = 1,
  term,
  year,
}) => {
  try {
    const res = await api.post(
      "/discipline",
      { admissionNumber, comment, type, severity, term, year },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    return res.data;
  } catch (err) {
    console.error("Error adding discipline record:", err.message);
    throw err;
  }
};

export const resolveDisciplineRecord = async (recordId, resolved) => {
  try {
    const res = await api.put(
      `/discipline/${recordId}/resolve`,
      { resolved },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    return res.data.discipline;
  } catch (err) {
    console.error("Error updating discipline record:", err.message);
    throw err;
  }
};

export const fetchAllDisciplineRecords = async () => {
  try {
    const res = await api.get("/discipline", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("Error fetching all discipline records:", err.message);
    throw err;
  }
};