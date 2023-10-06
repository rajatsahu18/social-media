import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  createPost,
  getPost,
  getPosts,
  getUserPost,
  getComments,
  likePost,
  likePostComment,
  commentPost,
  replyPostComment,
} from "../controllers/postController.js";

const router = express.Router();

// create post
router.post("/create-post", userAuth, createPost);

// get posts
router.post("/", userAuth, getPosts);
router.post("/:id", userAuth, getPost);

router.post("/get-user-post/:id", userAuth, getUserPost);

// get comments

router.get("/comments/:postId", getComments);

// like comment on posts
router.post("/like/:id", userAuth, likePost);
router.post("/like-comment/:id/:rid", userAuth, likePostComment);
router.post("/comment/:id", userAuth, commentPost);
router.post("/reply-comment/:id", userAuth, replyPostComment);


export default router;