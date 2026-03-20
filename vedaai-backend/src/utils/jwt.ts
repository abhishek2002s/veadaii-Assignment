import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET || "dev-secret", {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as string,
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "dev-secret") as TokenPayload;
  } catch {
    return null;
  }
}
