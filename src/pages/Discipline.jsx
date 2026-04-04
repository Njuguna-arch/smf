import React, { useEffect, useState } from "react";
import { fetchDisciplineComments } from "../services/disciplineService";
import DisciplineCard from "../components/DisciplineCard";

const Discipline = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      fetchDisciplineComments(user.id)
        .then((data) => setComments(data))
        .catch((err) => console.error("Failed to fetch discipline comments", err));
    }
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Discipline Comments</h2>
      {comments.length === 0 ? (
        <p>No discipline comments found.</p>
      ) : (
        <div>
          {comments.map((c) => (
            <DisciplineCard key={c._id} comment={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Discipline;