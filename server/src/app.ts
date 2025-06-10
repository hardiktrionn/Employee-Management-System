// src/index.ts
import express, { Handler } from "express";
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

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
import { RequestHandler } from "express";

app.use(
  "/api/employee",
  isAuthenticated as RequestHandler,
  isAdmin as RequestHandler,
  employeeRoute
);
app.use("/api/attendance", isAuthenticated as RequestHandler, attendanceRoute);
app.use("/api/leave",isAuthenticated as Handler,leaveRoute)

app.listen(3001, () => {
  console.log("Server run in port 3001");
});
