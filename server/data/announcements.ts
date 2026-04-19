import express from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();

interface Announcement {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
}

const dataFilePath = path.join(__dirname, "..", "data", "announcements.json");

async function readAnnouncements(): Promise<Announcement[]> {
  try {
    const data = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeAnnouncements(announcements: Announcement[]) {
  await fs.writeFile(
    dataFilePath,
    JSON.stringify(announcements, null, 2),
    "utf-8",
  );
}

router.get("/", async (_req, res) => {
  const announcements = await readAnnouncements();
  res.json(announcements);
});

router.post("/", async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({
      message: "Title, description, and category are required",
    });
  }

  const announcements = await readAnnouncements();

  const newAnnouncement: Announcement = {
    id: Date.now(),
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
