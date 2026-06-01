const express = require('express');
const commentController = require('../controllers/comment');
const { verify } = require('../auth');

const router = express.Router();

router.get('/post/:postId', commentController.getCommentsByPost);

router.post('/create', verify, commentController.createComment);

router.delete('/delete/:commentId', verify, commentController.deleteComment);

module.exports = router;
