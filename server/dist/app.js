"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const db_1 = __importDefault(require("./utils/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
const attendanceRoute_1 = __importDefault(require("./routes/attendanceRoute"));
const auth_1 = require("./middleware/auth");
const leaveRoute_1 = __importDefault(require("./routes/leaveRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.default)();
require("./config/passport");
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_HOST,
    credentials: true,
}));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/uploads", express_1.default.static("uploads"));
app.use("/api/auth", authRoutes_1.default);
app.use("/api/employee", auth_1.isAuthenticated, auth_1.isAdmin, employeeRoutes_1.default);
app.use("/api/attendance", auth_1.isAuthenticated, attendanceRoute_1.default);
app.use("/api/leave", auth_1.isAuthenticated, leaveRoute_1.default);
app.listen(3001, () => {
    console.log("Server run in port 3001");
});
