// Import necessary types and JWT library
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"; // Library for creating and verifying JSON Web Tokens

// Get JWT secret from environment variables (.env file)
// In production, this should be a long random string (change the default!)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * Extended Request interface that includes user data from JWT token
 * After authenticateToken middleware runs, req.user will contain the decoded token data
 */
export interface AuthRequest extends Request {
  user?: {
    id: number;        // User's database ID
    username: string;  // User's username
    role: string;      // User's role (leader or member)
  };
}

/**
 * Middleware function to authenticate JWT tokens
 * This runs before protected routes to verify the user is logged in
 *
 * How it works:
 * 1. Extracts the token from the Authorization header
 * 2. Verifies the token is valid and not expired
 * 3. Decodes the token to get user data
 * 4. Attaches user data to the request object
 * 5. Allows the request to continue to the actual route handler
 */
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  // Get the Authorization header from the request
  // Format expected: "Bearer <token>"
  const authHeader = req.headers["authorization"];

  //  Extract just the token part (remove "Bearer " prefix)
  const token = authHeader && authHeader.split(" ")[1];

  // Step 3: If no token provided, reject with 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    // Verify the token using the secret key
    // If token is invalid or expired, this will throw an error
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      username: string;
      role: string;
    };

    // Step 5: Attach the decoded user data to the request object
    // Now all route handlers can access req.user to know who is logged in
    req.user = decoded;

    // Step 6: Continue to the next middleware/route handler
    next();
  } catch (error) {
    // If token verification failed, return 403 Forbidden
    // This happens if:
    // - Token has expired
    // - Token was tampered with
    // - Token was signed with a different secret
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

/**
 * Generate a new JWT token for a user
 * Called after successful login or signup
 *
 * @param payload - User data to include in the token (id, username, role)
 * @returns A signed JWT token string that expires in 7 days
 */
export function generateToken(payload: { id: number; username: string; role: string }) {
  // Sign the payload with our secret key and set expiration to 7 days
  // The token contains the user data but is encrypted so it can't be tampered with
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
