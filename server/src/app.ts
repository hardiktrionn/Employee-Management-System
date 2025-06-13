// src/index.ts
import express, { Handler, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectDb from "./utils/db";
import authRoutes from "./routes/authRoutes";
import employeeRoute from "./routes/employeeRoutes";
import attendanceRoute from "./routes/attendanceRoute";
import leaveRoute from "./routes/leaveRoute"
import categoryRoute from "./routes/categoryRoute"
import postRoute from "./routes/postRoute"
import contactRoute from "./routes/contactRoute"
import { isAdmin, isAuthenticated } from "./middleware/auth";
import { RequestHandler } from "express";
import path from "path";

dotenv.config();

const app = express();
// connect with mongodb
connectDb();

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

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/auth", authRoutes);


// employee route
app.use(
  "/api/employee",
  isAuthenticated as RequestHandler,
  isAdmin as RequestHandler,
  employeeRoute
);
// attendance route
app.use("/api/attendance", isAuthenticated as RequestHandler, attendanceRoute);
// leave request route
app.use("/api/leave", isAuthenticated as Handler, leaveRoute)
app.use("/api/category", categoryRoute)
app.use("/api/post", postRoute)
app.use("/api/contact", contactRoute)

app.listen(3001, () => {
  console.log("Server run in port 3001");
});
