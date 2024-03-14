const Post = require("../Models/Post");
const User = require("../Models/User");
// Controller function to create a post
const createPost = async (req, res) => {
  const { userId, title, body } = req.body;

  try {
    // Create a new post
    const post = new Post({
      title,
      body,
      postedBy: userId, // Assigning the userId of the authenticated user
    });

    // Save the post to the database
    await post.save();

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error("Error creating post:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the post" });
  }
};

// Controller function to retrieve all posts for a user

const getAllPostsForUser = async (req, res) => {
  const { userId } = req.body; // Assuming userId is obtained from request body

  try {
    // Find all posts created by the user
    const posts = await Post.find({ postedBy: userId }).populate(
      "postedBy",
      "name email"
    );

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ error: "An error occurred while retrieving posts" });
  }
};

// Controller function to update a post//
const updatePost = async (req, res) => {
  const { postId, title, body } = req.body; // Assuming postId, title, and body are provided in the request body
  try {
    // Check if the post exists
    const post = await Post.findById(postId);

    // If the post does not exist, return an error
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Update the post fields
    post.title = title;
    post.body = body;

    // Save the updated post to the database
    await post.save();

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("Error updating post:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the post" });
  }
};

//deleting a post //

const deletePost = async (req, res) => {
  const { postId } = req.body; // Assuming postId is provided in the request body

  try {
    // Check if the post exists
    const post = await Post.findById(postId);

    // If the post does not exist, return an error
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Delete the post from the database
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the post" });
  }
};
// liking post //

const likePost = async (req, res) => {
  const { postId, userId } = req.body; // Assuming postId and userId are provided in the request body

  try {
    // Check if the post exists
    const post = await Post.findById(postId);

    // If the post does not exist, return an error
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    const alreadyLikedIndex = post.likes.findIndex(
      (like) => like.id && like.id.toString() === userId
    );

    if (alreadyLikedIndex !== -1) {
      // If the user has already liked the post, remove them from the likes array
      post.likes.splice(alreadyLikedIndex, 1);
    } else {
      // Append the user's name and ID to the likes array
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      post.likes.push({ name: user.name, id: userId });
    }
    // Save the updated post to the database
    await post.save();

    res.status(200).json({ message: "Like toggled successfully", post });
  } catch (error) {
    console.error("Error toggling like on post:", error);
    res
      .status(500)
      .json({ error: "An error occurred while toggling like on the post" });
  }
};

// Controller function to add a comment to a post //
const addComment = async (req, res) => {
  const { postId, userId, text, name } = req.body; // Assuming postId, userId, and text are provided in the request body
  const userName = name; // Assuming user's name is available in the request object

  try {
    // Check if the post exists
    const post = await Post.findById(postId);

    // If the post does not exist, return an error
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Add the comment to the post's comments array
    post.comments.push({
      text,
      userId,
      userName,
      date: new Date(),
    });

    // Save the updated post to the database
    await post.save();

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: post.comments });
  } catch (error) {
    console.error("Error adding comment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the comment" });
  }
};

module.exports = {
  createPost,
  getAllPostsForUser,
  updatePost,
  deletePost,
  likePost,
  addComment,
};
