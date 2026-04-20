import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { createServer } from "../../server/server";

// Mock Prisma so no real database connection is needed
vi.mock("../../server/data/db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    announcement: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    event: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from "../../server/data/db";

// Generate a valid JWT matching the secret used by the auth middleware
const JWT_SECRET = "your-secret-key-change-in-production";
const testToken = jwt.sign(
  { id: 1, username: "testuser", role: "member" },
  JWT_SECRET,
);
const authHeader = `Bearer ${testToken}`;

const app = createServer();

function mockAnnouncement(overrides = {}) {
  return {
    id: 1,
    title: "Test Announcement",
    description: "Test description",
    category: "General",
    author: "testuser",
    authorId: 1,
    user: { username: "testuser" },
    createdAt: new Date("2025-01-01T10:00:00Z"),
    updatedAt: new Date("2025-01-01T10:00:00Z"),
    ...overrides,
  };
}

// ============================================================
// GET /api/announcements
// ============================================================
describe("GET /api/announcements", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when no token is provided", async () => {
    const res = await request(app).get("/api/announcements");
    expect(res.status).toBe(401);
  });

  it("returns 403 when token is invalid", async () => {
    const res = await request(app)
      .get("/api/announcements")
      .set("Authorization", "Bearer invalid-token");
    expect(res.status).toBe(403);
  });

  it("returns 200 and an array when authenticated", async () => {
    vi.mocked(prisma.announcement.findMany).mockResolvedValue([
      mockAnnouncement(),
    ] as any);

    const res = await request(app)
      .get("/api/announcements")
      .set("Authorization", authHeader);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("returns an empty array when there are no announcements", async () => {
    vi.mocked(prisma.announcement.findMany).mockResolvedValue([]);

    const res = await request(app)
      .get("/api/announcements")
      .set("Authorization", authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

// ============================================================
// POST /api/announcements
// ============================================================
describe("POST /api/announcements", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates an announcement and returns 201", async () => {
    vi.mocked(prisma.announcement.create).mockResolvedValue(
      mockAnnouncement() as any,
    );

    const res = await request(app)
      .post("/api/announcements")
      .set("Authorization", authHeader)
      .send({
        title: "Test Announcement",
        description: "Test description",
        category: "General",
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test Announcement");
    expect(res.body).toHaveProperty("id");
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/announcements")
      .set("Authorization", authHeader)
      .send({ title: "Only title" });

    expect(res.status).toBe(400);
  });

  it("returns 400 when title is empty", async () => {
    const res = await request(app)
      .post("/api/announcements")
      .set("Authorization", authHeader)
      .send({ title: "", description: "Some text", category: "General" });

    expect(res.status).toBe(400);
  });

  it("returns 401 without an auth token", async () => {
    const res = await request(app)
      .post("/api/announcements")
      .send({ title: "Test", description: "Test", category: "General" });

    expect(res.status).toBe(401);
  });
});

// ============================================================
// PUT /api/announcements/:id
// ============================================================
describe("PUT /api/announcements/:id", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates an announcement and returns 200", async () => {
    vi.mocked(prisma.announcement.update).mockResolvedValue(
      mockAnnouncement({ title: "Updated Title", category: "Worship" }) as any,
    );

    const res = await request(app)
      .put("/api/announcements/1")
      .set("Authorization", authHeader)
      .send({
        title: "Updated Title",
        description: "Updated description",
        category: "Worship",
      });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Title");
  });

  it("returns 400 for a non-numeric ID", async () => {
    const res = await request(app)
      .put("/api/announcements/abc")
      .set("Authorization", authHeader)
      .send({ title: "Test", description: "Test", category: "General" });

    expect(res.status).toBe(400);
  });

  it("returns 401 without an auth token", async () => {
    const res = await request(app)
      .put("/api/announcements/1")
      .send({ title: "Test", description: "Test", category: "General" });

    expect(res.status).toBe(401);
  });
});

// ============================================================
// DELETE /api/announcements/:id
// ============================================================
describe("DELETE /api/announcements/:id", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deletes an announcement and returns 204", async () => {
    vi.mocked(prisma.announcement.delete).mockResolvedValue({} as any);

    const res = await request(app)
      .delete("/api/announcements/1")
      .set("Authorization", authHeader);

    expect(res.status).toBe(204);
  });

  it("returns 400 for a non-numeric ID", async () => {
    const res = await request(app)
      .delete("/api/announcements/xyz")
      .set("Authorization", authHeader);

    expect(res.status).toBe(400);
  });

  it("returns 401 without an auth token", async () => {
    const res = await request(app).delete("/api/announcements/1");
    expect(res.status).toBe(401);
  });
});
