const express = require("express");
const fs = require("fs").promises;
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const JSON_FILE_PATH = "./data/videos.json";

async function getVideos() {
  try {
    const videosJson = await fs.readFile(JSON_FILE_PATH);
    return JSON.parse(videosJson);
  } catch (error) {
    console.error("Error reading videos file:", error);
    return [];
  }
}

async function setVideos(videos) {
  try {
    const videosJson = JSON.stringify(videos, null, 2);
    await fs.writeFile(JSON_FILE_PATH, videosJson);
  } catch (error) {
    console.error("Error writing videos file:", error);
  }
}

const postValidator = (req, res, next) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required fields" });
  }

  next();
};

router.get("/", async (_req, res) => {
  try {
    const videos = await getVideos();
    const videosList = videos.map(({ id, title, channel, image }) => ({
      id,
      title,
      channel,
      image,
    }));
    res.status(200).json(videosList);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", postValidator, async (req, res) => {
  try {
    const { title, image, description } = req.body;
    const defaultValues = {
      channel: "Anonymous",
      views: 0,
      likes: 0,
      duration: "00:00",
      video: "",
      comments: [],
    };
    const videos = await getVideos();
    const newVideo = {
      id: uuidv4(),
      title,
      description,
      image,
      ...defaultValues,
      timestamp: Date.now(),
    };
    videos.push(newVideo);
    await setVideos(videos);
    res.status(201).json(newVideo);
  } catch (error) {
    console.error("Error adding video:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:videoId", async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const videos = await getVideos();
    const foundVideo = videos.find((video) => video.id === videoId);
    if (!foundVideo) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.status(200).json(foundVideo);
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
