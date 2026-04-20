import { describe, it, expect } from "vitest";
import {
  loginSchema,
  signupSchema,
  announcementSchema,
  eventSchema,
} from "../../server/utils/validation";

// ============================================================
// loginSchema
// ============================================================
describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      username: "testuser",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects username shorter than 3 characters", () => {
    const result = loginSchema.safeParse({
      username: "ab",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 6 characters", () => {
    const result = loginSchema.safeParse({
      username: "testuser",
      password: "123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing username", () => {
    const result = loginSchema.safeParse({ password: "password123" });
    expect(result.success).toBe(false);
  });

  it("rejects missing password", () => {
    const result = loginSchema.safeParse({ username: "testuser" });
    expect(result.success).toBe(false);
  });

  it("rejects username over 50 characters", () => {
    const result = loginSchema.safeParse({
      username: "a".repeat(51),
      password: "password123",
    });
    expect(result.success).toBe(false);
  });
});

// ============================================================
// signupSchema
// ============================================================
describe("signupSchema", () => {
  it("accepts valid signup data", () => {
    const result = signupSchema.safeParse({
      username: "newuser",
      password: "securepass",
      role: "member",
    });
    expect(result.success).toBe(true);
  });

  it("accepts leader role", () => {
    const result = signupSchema.safeParse({
      username: "newleader",
      password: "securepass",
      role: "leader",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid data with optional email", () => {
    const result = signupSchema.safeParse({
      username: "newuser",
      email: "user@example.com",
      password: "securepass",
      role: "member",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email format", () => {
    const result = signupSchema.safeParse({
      username: "newuser",
      email: "not-an-email",
      password: "securepass",
      role: "member",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid role", () => {
    const result = signupSchema.safeParse({
      username: "newuser",
      password: "securepass",
      role: "admin",
    });
    expect(result.success).toBe(false);
  });

  it("rejects username shorter than 3 characters", () => {
    const result = signupSchema.safeParse({
      username: "ab",
      password: "securepass",
      role: "member",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 6 characters", () => {
    const result = signupSchema.safeParse({
      username: "newuser",
      password: "abc",
      role: "member",
    });
    expect(result.success).toBe(false);
  });
});

// ============================================================
// announcementSchema
// ============================================================
describe("announcementSchema", () => {
  it("accepts valid announcement", () => {
    const result = announcementSchema.safeParse({
      title: "Team Meeting",
      description: "Meeting at 5pm in the main hall",
      category: "General",
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional author field", () => {
    const result = announcementSchema.safeParse({
      title: "Practice Cancelled",
      description: "Practice is cancelled this week",
      category: "Rehearsal",
      author: "Pastor John",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = announcementSchema.safeParse({
      title: "",
      description: "Some description",
      category: "General",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing description", () => {
    const result = announcementSchema.safeParse({
      title: "Team Meeting",
      category: "General",
    });
    expect(result.success).toBe(false);
  });

  it("rejects title over 200 characters", () => {
    const result = announcementSchema.safeParse({
      title: "a".repeat(201),
      description: "Some description",
      category: "General",
    });
    expect(result.success).toBe(false);
  });

  it("rejects description over 2000 characters", () => {
    const result = announcementSchema.safeParse({
      title: "Meeting",
      description: "a".repeat(2001),
      category: "General",
    });
    expect(result.success).toBe(false);
  });
});

// ============================================================
// eventSchema
// ============================================================
describe("eventSchema", () => {
  it("accepts a valid event with required fields only", () => {
    const result = eventSchema.safeParse({
      name: "Sunday Service",
      date: "2025-12-25T10:00:00Z",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid event with all optional fields", () => {
    const result = eventSchema.safeParse({
      name: "Band Practice",
      date: "2025-11-01T18:00:00Z",
      time: "6:00 PM",
      description: "Weekly band rehearsal",
      location: "Main Hall",
      eventType: "Rehearsal",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid date format", () => {
    const result = eventSchema.safeParse({
      name: "Sunday Service",
      date: "25/12/2025",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing event name", () => {
    const result = eventSchema.safeParse({
      date: "2025-12-25T10:00:00Z",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty event name", () => {
    const result = eventSchema.safeParse({
      name: "",
      date: "2025-12-25T10:00:00Z",
    });
    expect(result.success).toBe(false);
  });
});
