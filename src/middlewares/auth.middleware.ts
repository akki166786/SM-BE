import type { Request, Response, NextFunction } from "express";
import { verifyToken, extractTokenFromHeader } from "../utils/auth.js";
import { errors } from "../utils/errors.js";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw errors.unauthorized();
    }

    const payload = verifyToken(token);

    if (!payload) {
      throw errors.unauthorized();
    }

    (req as any).user = payload;
    next();
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }
    next(error);
  }
}
