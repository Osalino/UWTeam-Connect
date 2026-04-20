import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
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

const app = createServer();

const mockUserRow = {
  id: 1,
  username: "testuser",
  email: null,
  password: "hashed-placeholder",
  role: "member",
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ============================================================
// POST /api/auth/signup
// ============================================================
describe("POST /api/auth/signup", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 201 with user data and a token on valid signup", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue({
      ...mockUserRow,
      username: "newuser",
    });

    const res = await request(app).post("/api/auth/signup").send({
      username: "newuser",
      password: "securepass",
      role: "member",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.username).toBe("newuser");
    expect(res.body.user).not.toHaveProperty("password");
  });

  it("returns 409 if the username is already taken", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUserRow);

    const res = await request(app).post("/api/auth/signup").send({
      username: "testuser",
      password: "securepass",
      role: "member",
    });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Username already exists");
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ username: "newuser" });

    expect(res.status).toBe(400);
  });

  it("returns 400 when username is too short", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      username: "ab",
      password: "securepass",
      role: "member",
    });

    expect(res.status).toBe(400);
  });

  it("returns 400 when role is invalid", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      username: "newuser",
      password: "securepass",
      role: "admin",
    });

    expect(res.status).toBe(400);
  });
});

// ============================================================
// POST /api/auth/login
// ============================================================
describe("POST /api/auth/login", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with a token when credentials are correct", async () => {
    const bcrypt = await import("bcrypt");
    const hashed = await bcrypt.hash("correctpass", 10);

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...mockUserRow,
      password: hashed,
    });

    const res = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "correctpass",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.username).toBe("testuser");
  });

  it("returns 401 when user does not exist", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const res = await request(app).post("/api/auth/login").send({
      username: "nobody",
      password: "somepass",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid username or password");
  });

  it("returns 401 when password is wrong", async () => {
    const bcrypt = await import("bcrypt");
    const hashed = await bcrypt.hash("correctpass", 10);

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...mockUserRow,
      password: hashed,
    });

    const res = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "wrongpass",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid username or password");
  });

  it("returns 400 when username is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "somepass" });

    expect(res.status).toBe(400);
  });

  it("returns the same error message whether username or password is wrong", async () => {
    // Unknown user
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    const resUnknown = await request(app)
      .post("/api/auth/login")
      .send({ username: "unknown", password: "somepass" });

    // Wrong password
    const bcrypt = await import("bcrypt");
    const hashed = await bcrypt.hash("realpass", 10);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...mockUserRow,
      password: hashed,
    });
    const resWrong = await request(app)
      .post("/api/auth/login")
      .send({ username: "testuser", password: "wrongpass" });

    // Both must return the same generic message (security best practice)
    expect(resUnknown.body.message).toBe(resWrong.body.message);
  });
});
