const express = require("express");
const {
  createPost,
  getAllPostsForUser,
  updatePost,
  deletePost,
  likePost,
  addComment,
} = require("../Controllers/PostControllers");
const AuthorizeUser = require("../Middleware/Authorize");

const router = express.Router();

router.post("/create-post", AuthorizeUser, createPost);
router.get("/all-post",AuthorizeUser, getAllPostsForUser);
router.put("/update-post",AuthorizeUser, updatePost);
router.delete("/delete-post",AuthorizeUser, deletePost);
router.post("/like-unlike-post", AuthorizeUser , likePost);
router.post("/comment", AuthorizeUser, addComment);

module.exports = router;
