const express = require("express");
const {
  createPost,
  getAllPostsForUser,
  updatePost,
  deletePost,
  likePost,
  addComment,
} = require("../Controllers/PostControllers");

// middleware for validating requests through JWT token //
const JwtAuthorizer = require("../Middleware/JwtAuth");

const router = express.Router();

router.post("/create-post", JwtAuthorizer, createPost);
router.get("/all-post", JwtAuthorizer, getAllPostsForUser);
router.put("/update-post", JwtAuthorizer, updatePost);
router.delete("/delete-post", JwtAuthorizer, deletePost);
router.post("/like-unlike-post", JwtAuthorizer, likePost);
router.post("/comment", JwtAuthorizer, addComment);

module.exports = router;
