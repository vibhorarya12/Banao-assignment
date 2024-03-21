var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Loading environment variables from .env file
dotenv.config();

// Setting JWT secret key
const JWT_SECRET = process.env.JWT_SECRET;
const JwtAuthorizer = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    // console.error("Error verifying token:", error);
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = JwtAuthorizer;
