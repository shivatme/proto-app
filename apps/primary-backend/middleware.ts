import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization; //Bearer token
  const token = authHeader?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const publicKey = process.env.JWT_PUBLIC_KEY as string; // Ensure it's a string

  if (!publicKey) {
    throw new Error("JWT_PUBLIC_KEY is not set");
  }

  const decoded = jwt.verify(token, publicKey, {
    algorithms: ["RS256"],
  }) as JwtPayload;
  // console.log(decoded);
  if (!decoded) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const userId = (decoded as any).sub;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  req.userId = userId;
  next();
}
