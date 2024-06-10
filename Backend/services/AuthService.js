const jwt = require('jsonwebtoken');
require('dotenv').config();
const userService = require("../services/UserService");
const db = require("../database");
const bcrypt = require("bcrypt");

exports.login = async (username, password) => {
    const user = await db.User.findOne({ where: { username } });
    if (!user) throw new Error('No user found with name: ' + username)

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) throw new Error('Password is incorrect!');

    return generateAccessToken({ username });
}

exports.register = async (username, password, email, date_of_birth) => {
    const existingUser = await db.User.findOne({ where: { username } });
    if (existingUser) throw new Error('User already exists!');

    await userService.createUser(username, password, email, date_of_birth);
    return generateAccessToken({ username });
}

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, {expiresIn: '1800s'});
}

exports.authenticateToken = (req, res, next) => {
    // Check if the app is running in development mode
    if (process.env.NODE_ENV === 'development') {
        // For development, add a mock user to the request and bypass token verification
        req.user = { username: 'dummy' };
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};
