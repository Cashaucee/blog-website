const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');

module.exports.getCommentsByPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({ post: postId }).populate('author', 'username email').sort({ createdAt: -1 });
        return res.status(200).send(comments);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

module.exports.createComment = async (req, res) => {
    try {
        if (!req.user || !req.user.id) return res.status(401).send({ message: 'Unauthorized' });

        const { post: postId, content } = req.body;
        if (!postId) return res.status(400).send({ message: 'Missing post id' });
        if (!content || content.trim() === '') return res.status(400).send({ message: 'Empty comment' });

        const post = await Post.findById(postId);
        if (!post) return res.status(404).send({ message: 'Post not found' });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).send({ message: 'User not found' });

        const newComment = new Comment({
            content: content.trim(),
            author: user._id,
            authorName: user.username,
            post: post._id
        });

        const saved = await newComment.save();
        return res.status(201).send(saved);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

module.exports.deleteComment = async (req, res) => {
    try {
        if (!req.user || !req.user.id) return res.status(401).send({ message: 'Unauthorized' });

        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).send({ message: 'Comment not found' });

        const isOwner = comment.author.toString() === req.user.id;
        if (!isOwner && !req.user.isAdmin) return res.status(403).send({ message: 'Forbidden' });

        await Comment.deleteOne({ _id: comment._id });
        return res.status(200).send({ message: 'Comment deleted' });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
