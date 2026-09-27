import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "./db";
import { User, IUser } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "inject_ui_development_jwt_secret_key_987654321";

export interface JWTPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
  premium: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Extracts the token from either the HTTP cookie or Authorization header
 */
export function extractToken(request: NextRequest): string | null {
  // Check cookie first
  const cookieToken = request.cookies.get("inject_token")?.value;
  if (cookieToken) return cookieToken;

  // Check Authorization: Bearer <token>
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }

  return null;
}

/**
 * Resolves the authenticated user directly from the database to ensure
 * immediate revocation/granting of premium status.
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<IUser | null> {
  const token = extractToken(request);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || !payload.userId) return null;

  await connectDB();
  const user = await User.findById(payload.userId);
  return user;
}

export function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function unauthorizedResponse(message = "Authentication required") {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

export function forbiddenResponse(message = "Access denied") {
  return NextResponse.json({ success: false, message }, { status: 403 });
}

export function premiumRequiredResponse() {
  return NextResponse.json(
    {
      success: false,
      message: "Premium access required",
      code: "PREMIUM_REQUIRED",
    },
    { status: 403 }
  );
}
