import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
}

export function signToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET || "dev-secret";
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as any;
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "dev-secret") as TokenPayload;
  } catch {
    return null;
  }
}
