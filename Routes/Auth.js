const express = require("express");
const { createUser, loginUser, forgotPassword, resetPassword } = require("../Controllers/AuthControllers"); // Importing controller functions
const { body } = require("express-validator");

const router = express.Router();

// Route for creating a new user
router.post(
  "/createuser",
  [
    // Validation middleware for name, email, and password fields
    body("name").isLength({ min: 3 }), // Name should have at least 3 characters
    body("email").isEmail(), // Email should be in a valid format
    body("password", "password must have at least 5 characters").isLength({ min: 5 }), // Password should have at least 5 characters
  ],
  createUser // Controller function to handle user creation
);

// Route for user login
router.post(
  "/login",
  [
    // Validation middleware for email and password fields
    body("email", "Enter valid email address").isEmail(), // Email should be in a valid format
    body("password", "Password cannot be blank").exists(), // Password should not be blank
  ],
  loginUser // Controller function to handle user login
);

// Route for forgot password
router.post("/forgot-password", forgotPassword); // Controller function to handle forgot password

// Route for resetting password
router.post("/reset-password/:id/:token", resetPassword); // Controller function to handle password reset

module.exports = router;
