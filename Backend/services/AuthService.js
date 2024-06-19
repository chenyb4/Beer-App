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

    const roleId = user.roleId;
    return generateAccessToken({ username, roleId });
}

exports.register = async (username, password, email, date_of_birth) => {
    const existingUser = await db.User.findOne({ where: { username } });
    if (existingUser) throw new Error('User already exists!');

    await userService.createUser(username, password, email, date_of_birth);
    return generateAccessToken({ username });
}

function generateAccessToken(user) {
    return jwt.sign({user}, process.env.TOKEN_SECRET, {expiresIn: '1800s'});
}

function developmentCheck(req){
    // Check if the app is running in development mode
    if (process.env.NODE_ENV === 'development') {
        // For development, add a mock user to the request and bypass token verification
        req.user = { id: 1, username: 'dummy' };
        return true
    }
}

function validateToken(req, res, next, needsAdmin = true) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, wrapper) => {
        if (err) {
            console.error(err);
            return res.status(403).json({error: 'Invalid token'});
        }

        const user = await db.User.findOne({ where: { username: wrapper.user.username } })

        if (needsAdmin){
            if(user.roleId !== 4){
                return res.status(403).json({error: 'No access'});
            } else {
                req.user = user
                next()
            }
        } else {
            req.user = user
            next();
        }

    });
}

exports.authenticateTokenForSeller = (req, res, next) => {
    if(developmentCheck(req)) return next();
    validateToken(req, res, next, false)
}

exports.authenticateToken = (req, res, next) => {
    if(developmentCheck(req)) return next();
    validateToken(req, res, next)
};
