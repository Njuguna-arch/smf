import React, { useState, useEffect } from "react";
import { fetchVideos } from "../services/videoService";

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [grade, setGrade] = useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVideos();
  }, [search, subject, grade]);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const data = await fetchVideos(subject, grade, search);
      setVideos(data);
    } catch (err) {
      console.error("Failed to fetch videos", err);
    } finally {
      setLoading(false);
    }
  };

  const toEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("watch?v=")) {
      const id = new URLSearchParams(new URL(url).search).get("v");
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("youtu.be")) {
      const id = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>🎬 Video Hub</h2>

      <div
        style={{
          marginBottom: "2rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search videos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "0.5rem",
            flex: "1",
            minWidth: "200px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "6px" }}
        >
          <option value="All">All Subjects</option>
          <option value="Math">Math</option>
          <option value="Science">Science</option>
          <option value="English">English</option>
          <option value="Kiswahili">Kiswahili</option>
          <option value="Social Studies">Social Studies</option>
          <option value="CRE">CRE</option>
          <option value="Pre-Tech">Pre-Tech</option>
          <option value="Creative Arts">Creative Arts</option>
          <option value="Agriculture">Agriculture</option>
        </select>
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "6px" }}
        >
          <option value="All">All Grades</option>
          <option value="Grade 1">Grade 1</option>
          <option value="Grade 2">Grade 2</option>
          <option value="Grade 3">Grade 3</option>
          <option value="Grade 4">Grade 4</option>
          <option value="Grade 5">Grade 5</option>
          <option value="Grade 6">Grade 6</option>
          <option value="Grade 7">Grade 7</option>
          <option value="Grade 8">Grade 8</option>
          <option value="Grade 9">Grade 9</option>
        </select>
      </div>

      {loading && <p>Loading videos...</p>}
      {!loading && videos.length === 0 && <p>No videos found.</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {videos.map((video) => (
          <div
            key={video._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              backgroundColor: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h4 style={{ marginBottom: "0.5rem" }}>{video.title}</h4>
            <iframe
              width="100%"
              height="200"
              src={toEmbedUrl(video.url)}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: "6px" }}
            ></iframe>
            <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#555" }}>
              {video.description}
            </p>
            <p style={{ fontSize: "0.8rem", color: "#777" }}>
              {video.type} | {video.subject} | {video.grade}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videos;