// Announcements router - handles GET and POST for team announcements
// Data is stored in a local JSON file (announcements.json)
import express from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();

// Shape of an announcement object
interface Announcement {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
}

// Path to the JSON file used as the data store
const dataFilePath = path.join(__dirname, "..", "data", "announcements.json");

// Read all announcements from the JSON file
async function readAnnouncements(): Promise<Announcement[]> {
  try {
    const data = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return []; // Return empty array if file doesn't exist yet
  }
}

// Write the updated announcements array back to the JSON file
async function writeAnnouncements(announcements: Announcement[]) {
  await fs.writeFile(
    dataFilePath,
    JSON.stringify(announcements, null, 2),
    "utf-8",
  );
}

// GET /api/announcements - return all announcements
router.get("/", async (_req, res) => {
  const announcements = await readAnnouncements();
  res.json(announcements);
});

// POST /api/announcements - create a new announcement
router.post("/", async (req, res) => {
  const { title, description, category } = req.body;

  // Validate required fields
  if (!title || !description || !category) {
    return res.status(400).json({
      message: "Title, description, and category are required",
    });
  }

  const announcements = await readAnnouncements();

  const newAnnouncement: Announcement = {
    id: Date.now(), // Use timestamp as a simple unique ID
    title,
    description,
    category,
    author: "Temporary User",
    date: new Date().toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
  };

  announcements.push(newAnnouncement);
  await writeAnnouncements(announcements);

  res.status(201).json(newAnnouncement);
});

export default router;
