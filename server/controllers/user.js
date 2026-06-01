const User = require('../models/User');
const bcrypt = require("bcryptjs");
const auth = require("../auth");

module.exports.registerUser = async (req, res) => {
    try {
        let { username, email, password } = req.body

        // Basic validation
        if (!email || !email.includes('@')) return res.status(400).send({ message: 'Invalid email' });
        if (!password || password.length < 8) return res.status(400).send({ message: 'Password must be at least 8 characters' });

        // If username not provided, generate one from email local-part
        if (!username || username.length < 4) {
            const local = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            username = local || ('user' + Math.floor(Math.random() * 10000));
        }

        // Ensure username is at least 4 chars
        if (username.length < 4) username = username.padEnd(4, '0');

        // Check for duplicate email first
        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(409).send({ message: 'Duplicate email found' });

        // Check username
        const foundUsername = await User.findOne({ username });
        if (foundUsername) return res.status(409).send({ message: 'Duplicate username found' });

        const newUser = new User({
            username,
            email,
            password: bcrypt.hashSync(password, 10)
        });

        await newUser.save();
        return res.status(201).send({ message: 'Registration successful' });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        const identifier = req.body.email || req.body.username || "";

        if (typeof identifier !== 'string' || identifier.trim() === '') {
            return res.status(400).send({ message: 'Invalid identifier' });
        }

        const findQuery = identifier.includes("@") ? { email: identifier } : { username: identifier };

        const result = await User.findOne(findQuery);
        if (!result) return res.status(404).send({ message: 'User not found' });

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
        if (isPasswordCorrect) return res.status(200).send({ access: auth.createAccessToken(result) });
        return res.status(401).send({ message: 'Invalid credentials' });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

module.exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).send({ message: 'User not found' });
        user.password = "";
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};