import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: string;
}

interface AuthenticatedRequest extends Request {
  user?: CustomJwtPayload;
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): Response | void => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(404).json({ message: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
};
