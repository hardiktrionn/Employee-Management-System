const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDb = require("./utils/db");
const app = express();
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");

const authRoutes = require("./routes/authRoutes");
const employeeRoute = require("./routes/employeeRoutes");
const { isAuthenticated, isAdmin } = require("./middleware/auth");
connectDb();

require("./config/passport");

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_HOST,
    credentials: true,
  })
);
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/employee", isAuthenticated, isAdmin, employeeRoute);

app.listen(3001, () => {
  console.log("Server run in port 3001");
});
