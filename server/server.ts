// Import necessary packages for the server
import express from "express"; // Web framework for building REST APIs
import cors from "cors"; // Enable Cross-Origin Resource Sharing for frontend-backend communication
import bcrypt from "bcrypt"; // Library for hashing passwords securely
import { prisma } from "./data/db"; // Prisma ORM client for database operations
import { authenticateToken, generateToken, AuthRequest } from "./middleware/auth"; // JWT authentication middleware
import {
  sanitizeString, // Function to prevent XSS attacks by cleaning user input
  loginSchema, // Zod schema for validating login data
  signupSchema, // Zod schema for validating signup data
  announcementSchema, // Zod schema for validating announcement data
} from "./utils/validation";

export function createServer() {
  const app = express();

  // Enable CORS so the frontend can communicate with the backend
  app.use(cors());

  // Parse JSON request bodies automatically
  app.use(express.json());

  // ============================================================================
  // PUBLIC AUTHENTICATION ROUTES (No token required)
  // ============================================================================

  /**
   * POST /api/auth/signup
   * Register a new user account
   *
   * Request body: { username, email (optional), password, role }
   * Response: { user: { id, username, role }, token }
   */
  app.post("/api/auth/signup", async (req, res) => {
    try {
      // Step 1: Validate the incoming data using Zod schema
      // This checks: username (3-50 chars), password (6-100 chars), role (leader/member)
      const validatedData = signupSchema.parse(req.body);
      const { username, email, password, role } = validatedData;

      // Step 2: Sanitize user inputs to prevent XSS (Cross-Site Scripting) attacks
      // This removes dangerous characters like <, >, &, etc.
      const sanitizedUsername = sanitizeString(username);
      const sanitizedEmail = email ? sanitizeString(email) : undefined;

      // Step 3: Check if username already exists in the database
      const existingUser = await prisma.user.findUnique({
        where: { username: sanitizedUsername },
      });

      // If username is taken, return 409 Conflict status
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }

      // Step 4: Hash the password using bcrypt with 10 salt rounds
      // This makes the password unreadable and secure in the database
      // Even if the database is compromised, passwords remain protected
      const hashedPassword = await bcrypt.hash(password, 10);

      // Step 5: Create the new user in the database
      const newUser = await prisma.user.create({
        data: {
          username: sanitizedUsername,
          email: sanitizedEmail,
          password: hashedPassword, // Store hashed password, NEVER plain text
          role,
          status: "active",
        },
      });

      // Step 6: Generate a JWT (JSON Web Token) for authentication
      // This token expires in 7 days and contains user info
      const token = generateToken({
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
      });

      // Step 7: Send success response with user data and token
      // The token will be stored in localStorage on the frontend
      res.status(201).json({
        user: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
        },
        token, // Client stores this and sends it with every request
      });
    } catch (error) {
      // Check for validation errors BEFORE logging (ZodError causes console.error to crash in Node 24)
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid input data" });
      }
      process.stderr.write(`Failed to sign up user: ${error instanceof Error ? error.message : String(error)}\n`);
      res.status(500).json({ message: "Failed to sign up user" });
    }
  });

  /**
   * POST /api/auth/login
   * Authenticate an existing user
   *
   * Request body: { username, password }
   * Response: { user: { id, username, role }, token }
   */
  app.post("/api/auth/login", async (req, res) => {
    try {
      // Step 1: Validate the login credentials
      const validatedData = loginSchema.parse(req.body);
      const { username, password } = validatedData;

      // Step 2: Sanitize the username input to prevent XSS
      const sanitizedUsername = sanitizeString(username);

      // Step 3: Find the user in the database by username
      const user = await prisma.user.findUnique({
        where: { username: sanitizedUsername },
      });

      // If user doesn't exist, return generic error message
      // We don't specify if username or password is wrong (security best practice)
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Step 4: Compare the provided password with the hashed password in database
      // bcrypt.compare() hashes the input and compares with stored hash
      const isValidPassword = await bcrypt.compare(password, user.password);

      // If password doesn't match, return the same generic error
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Step 5: Generate a new JWT token for this login session
      const token = generateToken({
        id: user.id,
        username: user.username,
        role: user.role,
      });

      // Step 6: Return user info and token
      res.json({
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid input data" });
      }
      process.stderr.write(`Failed to log in user: ${error instanceof Error ? error.message : String(error)}\n`);
      res.status(500).json({ message: "Failed to log in user" });
    }
  });

  // ============================================================================
  // PROTECTED ROUTES - ANNOUNCEMENTS (Requires valid JWT token)
  // ============================================================================

  /**
   * GET /api/announcements
   * Fetch all announcements (Protected route)
   *
   * Headers required: Authorization: Bearer <token>
   * Response: Array of announcements with author info
   */
  app.get("/api/announcements", authenticateToken, async (_req, res) => {
    try {
      // Fetch all announcements from database, ordered by newest first
      // Include the author's username from the related User table
      const announcements = await prisma.announcement.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              username: true, // Only get username, not password or other sensitive data
            },
          },
        },
      });

      // Format the announcements for the frontend
      const formatted = announcements.map((announcement) => ({
        id: announcement.id,
        title: announcement.title,
        description: announcement.description,
        category: announcement.category,
        author: announcement.user?.username || announcement.author, // Use related user or fallback
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
      process.stderr.write(`Failed to fetch announcements: ${error instanceof Error ? error.message : String(error)}\n`);
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });

  /**
   * POST /api/announcements
   * Create a new announcement (Protected route)
   *
   * Headers required: Authorization: Bearer <token>
   * Request body: { title, description, category }
   * Response: The created announcement
   */
  app.post("/api/announcements", authenticateToken, async (req: AuthRequest, res) => {
    try {
      // Step 1: Validate the announcement data
      const validatedData = announcementSchema.parse(req.body);
      const { title, description, category } = validatedData;

      // Step 2: Sanitize all text inputs to prevent XSS attacks
      const sanitizedTitle = sanitizeString(title);
      const sanitizedDescription = sanitizeString(description);
      const sanitizedCategory = sanitizeString(category);

      // Step 3: Create the announcement in database
      // req.user contains the decoded JWT token data (set by authenticateToken middleware)
      const newAnnouncement = await prisma.announcement.create({
        data: {
          title: sanitizedTitle,
          description: sanitizedDescription,
          category: sanitizedCategory,
          author: req.user?.username || "Anonymous", // Use logged-in user's name
          authorId: req.user?.id, // Link to the user who created it
        },
      });

      // Step 4: Return the created announcement
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
      process.stderr.write(`Failed to create announcement: ${error instanceof Error ? error.message : String(error)}\n`);

      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid input data" });
      }

      res.status(500).json({ message: "Failed to create announcement" });
    }
  });

  // ============================================================================
  // PROTECTED ROUTES - TEAM MEMBERS (Requires valid JWT token)
  // ============================================================================

  /**
   * GET /api/team-members
   * Fetch all team members (Protected route)
   *
   * Headers required: Authorization: Bearer <token>
   * Response: Array of users (without passwords)
   */
  app.get("/api/team-members", authenticateToken, async (_req, res) => {
    try {
      // Fetch all users from database, ordered by newest first
      // IMPORTANT: We explicitly select only safe fields (no passwords!)
      const members = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          role: true,
          status: true,
          createdAt: true,
          // password is NOT selected - never send passwords to frontend!
        },
      });

      res.json(members);
    } catch (error) {
      process.stderr.write(`Failed to fetch team members: ${error instanceof Error ? error.message : String(error)}\n`);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  return app;
}
