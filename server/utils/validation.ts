// Import Zod - a TypeScript-first schema validation library
import { z } from "zod";

/**
 * Sanitize string input to prevent XSS (Cross-Site Scripting) attacks
 *
 * XSS attacks occur when malicious users inject HTML/JavaScript into text fields
 * Example: A user enters "<script>alert('hacked')</script>" as their username
 *
 * This function converts dangerous characters to safe HTML entities:
 * < becomes &lt;
 * > becomes &gt;
 * " becomes &quot;
 * ' becomes &#x27;
 * / becomes &#x2F;
 *
 * @param input - The string to sanitize
 * @returns The sanitized string safe for display
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, "&lt;")      // Replace < with &lt;
    .replace(/>/g, "&gt;")      // Replace > with &gt;
    .replace(/"/g, "&quot;")    // Replace " with &quot;
    .replace(/'/g, "&#x27;")    // Replace ' with &#x27;
    .replace(/\//g, "&#x2F;")   // Replace / with &#x2F;
    .trim();                     // Remove leading/trailing whitespace
}

// ============================================================================
// VALIDATION SCHEMAS - Define the shape and rules for incoming data
// ============================================================================

/**
 * Login validation schema
 * Validates username and password for login requests
 *
 * Rules:
 * - username: Must be 3-50 characters
 * - password: Must be 6-100 characters
 */
export const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
});

/**
 * Signup validation schema
 * Validates all fields needed to create a new user account
 *
 * Rules:
 * - username: Required, 3-50 characters
 * - email: Optional, must be valid email format if provided
 * - password: Required, 6-100 characters (for security)
 * - role: Required, must be either "leader" or "member"
 */
export const signupSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().optional(),  // Optional field
  password: z.string().min(6).max(100),  // Minimum 6 chars for security
  role: z.enum(["leader", "member"]),    // Must be one of these two values
});

/**
 * Announcement validation schema
 * Validates data for creating announcements
 *
 * Rules:
 * - title: Required, 1-200 characters
 * - description: Required, 1-2000 characters
 * - category: Required, 1-100 characters
 * - author: Optional, max 100 characters (usually set from JWT token)
 */
export const announcementSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  category: z.string().min(1).max(100),
  author: z.string().max(100).optional(),
});

/**
 * Event validation schema
 * Validates data for creating calendar events
 *
 * Rules:
 * - name: Required, 1-200 characters
 * - date: Required, must be valid ISO datetime string
 * - time: Optional, max 50 characters
 * - description: Optional, max 2000 characters
 * - location: Optional, max 200 characters
 * - eventType: Optional, max 100 characters
 */
export const eventSchema = z.object({
  name: z.string().min(1).max(200),
  date: z.string().datetime(),  // Must be ISO 8601 format (e.g., "2024-12-25T10:00:00Z")
  time: z.string().max(50).optional(),
  description: z.string().max(2000).optional(),
  location: z.string().max(200).optional(),
  eventType: z.string().max(100).optional(),
});
