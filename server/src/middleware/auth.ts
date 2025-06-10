import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Employee from "../schema/employeeSchema";

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

interface AuthenticatedRequest extends Request {
  user?: CustomJwtPayload;
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(404).json({ message: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
    let find = await Employee.findById(decoded.id).select("role email name")

    if (!find) return res.status(404).json({ message: "User not found" });

    req.user = { role: find.role, id: decoded.id, email: find.email, name: find.name }
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
