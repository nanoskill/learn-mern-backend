import express from "express";

import {
  getPosts,
  createPost,
  updatePost,
  getPostById,
  deletePost,
  likePost,
} from "../controllers/posts.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/", createPost);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);
router.patch("/:id/likePost/:cnt", likePost);

export default router;
