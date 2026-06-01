const express = require('express');
const postController = require('../controllers/post');

const { verify } = require("../auth");

const router = express.Router();

/* ACTIVITY SOLUTION START */
router.get("/", postController.getPosts);

router.get("/:postId", postController.getPost);

router.post("/create", verify, postController.createPost);

router.patch("/update/:postId", verify, postController.updatePost);

router.delete("/delete/:postId", verify, postController.deletePost)

module.exports = router;
