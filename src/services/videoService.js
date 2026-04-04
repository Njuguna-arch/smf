import api from "./api";

const normalizeVideos = (data) =>
  data.map((video) => ({
    ...video,
    url: video.videoUrl,
  }));

export const fetchVideos = async (
  subject = "All",
  grade = "All",
  keyword = "",
  type = "All"
) => {
  try {
    const res = await api.get("/videos", {
      params: { subject, grade, keyword, type },
    });
    return normalizeVideos(res.data);
  } catch (error) {
    console.error("Error fetching videos:", error.message);
    throw error;
  }
};

export const addVideo = async (videoData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.post("/videos", videoData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { ...res.data, url: res.data.videoUrl };
  } catch (error) {
    console.error("Error adding video:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchFeaturedVideos = async () => {
  try {
    const res = await api.get("/videos/featured");
    return normalizeVideos(res.data);
  } catch (error) {
    console.error("Error fetching featured videos:", error.message);
    throw error;
  }
};