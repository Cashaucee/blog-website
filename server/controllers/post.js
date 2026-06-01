const Post = require('../models/Post');
const User = require('../models/User');

module.exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username email').sort({ createdAt: -1 });
        // Return an empty array when there are no posts to keep the API shape consistent
        if (posts.length === 0) {
            return res.status(200).send([]);
        }
        return res.status(200).send(posts);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

module.exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate('author', 'username email');
        if (!post) return res.status(404).send({ message: 'Post not found' });
        return res.status(200).send(post);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

module.exports.createPost = async (req, res) => {
    try {
        if (!req.user || !req.user.id) return res.status(401).send({ message: 'Unauthorized' });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).send({ message: 'Author not found' });

        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            author: user._id,
            authorName: user.username
        });

        const saved = await newPost.save();
        return res.status(201).send(saved);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

module.exports.updatePost = async (req, res) => {
    try {
        if (!req.user || !req.user.id) return res.status(401).send({ message: 'Unauthorized' });

        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).send({ message: 'Post not found' });

        const isOwner = post.author.toString() === req.user.id;
        if (!isOwner) return res.status(403).send({ message: 'Forbidden' });

        if (req.body.title !== undefined) post.title = req.body.title;
        if (req.body.content !== undefined) post.content = req.body.content;

        const updated = await post.save();
        return res.status(200).send(updated);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

module.exports.deletePost = async (req, res) => {
    try {
        if (!req.user || !req.user.id) return res.status(401).send({ message: 'Unauthorized' });

        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).send({ message: 'Post not found' });

        const isOwner = post.author.toString() === req.user.id;
        if (!isOwner && !req.user.isAdmin) return res.status(403).send({ message: 'Forbidden' });

        await Post.deleteOne({ _id: post._id });
        return res.status(200).send({ message: 'Post deleted' });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};