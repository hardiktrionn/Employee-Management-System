const jwt = require("jsonwebtoken");
const generateToken = (data, expiresIn = "1d") => {
  const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn });
  return token;
};

module.exports = generateToken;
