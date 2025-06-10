// src/index.ts
import express, { Handler, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import connectDb from "./utils/db";
import authRoutes from "./routes/authRoutes";
import employeeRoute from "./routes/employeeRoutes";
import attendanceRoute from "./routes/attendanceRoute";
import { isAdmin, isAuthenticated } from "./middleware/auth";
import leaveRoute from "./routes/leaveRoute"
import fs from "fs"

dotenv.config();

const app = express();
connectDb();

require("./config/passport");

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_HOST,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/uploads/:filename", isAuthenticated as RequestHandler, (req: Request, res: Response) => {
  const filename = req.params.filename;

  // Prevent path traversal (e.g., ../../../etc/passwd)
  const safeFilename = path.basename(filename);
  const filePath = path.join(__dirname, "uploads", safeFilename);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "File not found" });
    return;
  }

  // Set headers for download
  res.download(filePath, safeFilename, err => {
    if (err) {

      res.status(500).end();
    }
  });
});
app.use("/api/auth", authRoutes);
import { RequestHandler } from "express";
import path from "path";

app.use(
  "/api/employee",
  isAuthenticated as RequestHandler,
  isAdmin as RequestHandler,
  employeeRoute
);
app.use("/api/attendance", isAuthenticated as RequestHandler, attendanceRoute);
app.use("/api/leave", isAuthenticated as Handler, leaveRoute)

app.listen(3001, () => {
  console.log("Server run in port 3001");
});
