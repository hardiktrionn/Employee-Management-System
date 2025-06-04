const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDb = require("./utils/db");
const app = express();
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
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

app.listen(3001, () => {
  console.log("Server run in port 3001");
});
