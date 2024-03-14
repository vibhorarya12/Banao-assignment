// Importing required modules
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../Models/User");
const dotenv = require("dotenv");

// Loading environment variables from .env file
dotenv.config();

// Setting JWT secret key
const JWT_SECRET = process.env.JWT_SECRET;

// Function to handle user creation
const createUser = async (req, res) => {
  let success = false;

  // Validate request body using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        success,
        errors: "User with this email already exists",
      });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Creating new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });

    // Creating JWT token
    const data = {
      user: {
        id: user.id,
      },
    };
    const authToken = jwt.sign(data, JWT_SECRET);

    success = true;
    res.json({ success, authToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occurred");
  }
};

// Function to handle user login
const loginUser = async (req, res) => {
  let success = false;

  // Validate request body using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    // Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: "Invalid credentials!!" });
    }

    // Compare password
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ errors: "Invalid credentials!!" });
    }

    // Create JWT token
    const data = {
      user: {
        id: user.id,
      },
    };
    const authToken = jwt.sign(data, JWT_SECRET);

    success = true;
    res.json({
      success,
      authToken,
      name: user.name,
      email: user.email,
      userId : user._id
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
};

// Function to handle forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.send({ Status: "User not found" });
    }

    // Generate token for password reset
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    // Setup nodemailer for sending email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    // Compose email message
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Update Verification",
      text: `${process.env.HOST}/auth/reset-password/${user._id}/${token}`,
    };

    // Send email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.send({ Status: "Success" });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
};

// Function to handle password reset
const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  // Check if password is provided
  if (!password) {
    return res.status(400).json({ error: "Password not provided" });
  }

  // Verify JWT token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: "Invalid token" });
    } else {
      // Hash the new password
      bcrypt.hash(password, 10)
        .then(hash => {
          // Update user password in the database
          User.findByIdAndUpdate({ _id: id }, { password: hash })
            .then(u => res.json({ message: "Password updated successfully" }))
            .catch(err => res.status(500).json({ error: "Error updating password in database" }));
        })
        .catch(err => res.status(500).json({ error: "Error hashing password" }));
    }
  });
};

// Exporting functions
module.exports = { createUser, loginUser, forgotPassword, resetPassword };
