import express from "express";
import cors from "cors";

type Role = "leader" | "member";

interface AnnouncementRecord {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  createdAt: Date;
}

interface UserRecord {
  id: number;
  username: string;
  password: string;
  role: Role;
  createdAt: Date;
}

const announcements: AnnouncementRecord[] = [];
const users: UserRecord[] = [];

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/api/announcements", async (_req, res) => {
    try {
      const ordered = [...announcements].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );

      const formatted = ordered.map((announcement) => ({
        id: announcement.id,
        title: announcement.title,
        description: announcement.description,
        category: announcement.category,
        author: announcement.author,
        date: announcement.createdAt.toLocaleString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
      }));

      res.json(formatted);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });

  app.post("/api/announcements", async (req, res) => {
    try {
      const { title, description, category, author } = req.body;

      if (!title || !description || !category) {
        return res.status(400).json({
          message: "Title, description, and category are required",
        });
      }

      const newAnnouncement: AnnouncementRecord = {
        id: Date.now(),
        title,
        description,
        category,
        author: author || "Anonymous",
        createdAt: new Date(),
      };

      announcements.push(newAnnouncement);

      res.status(201).json({
        id: newAnnouncement.id,
        title: newAnnouncement.title,
        description: newAnnouncement.description,
        category: newAnnouncement.category,
        author: newAnnouncement.author,
        date: newAnnouncement.createdAt.toLocaleString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
      });
    } catch (error) {
      console.error("Failed to create announcement:", error);
      res.status(500).json({ message: "Failed to create announcement" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { username, password, role } = req.body;

      if (!username || !password || !role) {
        return res.status(400).json({
          message: "Username, password, and role are required",
        });
      }

      const existingUser = users.find((user) => user.username === username);
      if (existingUser) {
        return res.status(409).json({
          message: "Username already exists",
        });
      }

      const newUser: UserRecord = {
        id: Date.now(),
        username,
        password,
        role,
        createdAt: new Date(),
      };

      users.push(newUser);

      res.status(201).json({
        user: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error("Failed to sign up user:", error);
      res.status(500).json({ message: "Failed to sign up user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          message: "Username and password are required",
        });
      }

      const user = users.find(
        (member) => member.username === username && member.password === password,
      );

      if (!user) {
        return res.status(401).json({
          message: "Invalid username or password",
        });
      }

      res.json({
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Failed to log in user:", error);
      res.status(500).json({ message: "Failed to log in user" });
    }
  });

  app.get("/api/team-members", async (_req, res) => {
    try {
      const members = [...users]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map((user) => ({
          id: user.id,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
        }));

      res.json(members);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  return app;
}
