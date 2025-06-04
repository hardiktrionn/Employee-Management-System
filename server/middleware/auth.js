const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  if (!req.cookies || !req.cookies.token) {
    return res.status(404).json({ message: "Token not found" });
  }

  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role != "admin") {
    return res.status(400).json({ message: "Not Access" });
  }
  next();
};

module.exports = { isAuthenticated, isAdmin };
