import mongoose from "mongoose";
import PostMessage from "../models/postMessages.js";

export const getPostById = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that ID!");

  const selectedPost = await PostMessage.findById(_id);
  res.json(selectedPost);
};

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();
    console.log(`get posts called: ${postMessages.length}`);
    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    name: post.name,
  });
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;

  const post = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that ID!");

  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
  });
  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that ID!");

  await PostMessage.findByIdAndRemove(_id);
  res.json({ message: "Post deleted successfully!" });
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that ID!");

  const post = await PostMessage.findById(id);
  const index = post.likes.findIndex((userId) => userId === String(req.userId));
  console.log(index);
  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};
