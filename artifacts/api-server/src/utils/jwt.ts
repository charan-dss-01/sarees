import jwt from "jsonwebtoken";

const JWT_SECRET  = () => {
  const s = process.env["JWT_SECRET"];
  if (!s) throw new Error("JWT_SECRET environment variable is required.");
  return s;
};
const JWT_EXPIRES = process.env["JWT_EXPIRES_IN"] ?? "7d";

export function signToken(payload: { id: string; email: string }): string {
  return jwt.sign(payload, JWT_SECRET(), { expiresIn: JWT_EXPIRES } as jwt.SignOptions);
}

export function verifyToken(token: string): { id: string; email: string; iat: number; exp: number } {
  return jwt.verify(token, JWT_SECRET()) as { id: string; email: string; iat: number; exp: number };
}
