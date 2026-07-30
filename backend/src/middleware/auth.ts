import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/auth";

export interface AuthPayload {
  id: number | string;
  email: string;
  role: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      authUser?: AuthPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const payload = token ? verifyToken(token) : null;

  if (!token || !payload) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  req.authUser = payload;

  next();
}

export function requireAuthForMutations(req: Request, res: Response, next: NextFunction) {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    return next();
  }

  return requireAuth(req, res, next);
}

/**
 * Restricts a route to admin-role accounts (Super Admin / Admin).
 * Must run after requireAuth (or requireAuthForMutations for a mutation),
 * since it depends on req.authUser being populated.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const payload = token ? verifyToken(token) : null;

  if (!token || !payload) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  req.authUser = payload;

  if (payload.role !== "admin" && payload.role !== "superadmin") {
    return res.status(403).json({
      message: "Administrator access required",
    });
  }

  next();
}
