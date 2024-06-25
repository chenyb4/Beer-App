const jwt = require('jsonwebtoken');
require('dotenv').config();
const userService = require("../services/UserService");
const db = require("../database");
const bcrypt = require("bcrypt");

exports.login = async (username, password) => {
    const user = await db.User.findOne({where: {username}});
    if (!user) throw new Error('No user found with name: ' + username)

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) throw new Error('Password is incorrect!');

    const roleId = user.roleId;
    return generateAccessToken({username, roleId});
}

exports.register = async (username, password, email, date_of_birth) => {
    const existingUser = await db.User.findOne({where: {username}});
    if (existingUser) throw new Error('User already exists!');

    await userService.createUser(username, password, email, date_of_birth);
    return generateAccessToken({username});
}

function generateAccessToken(user) {
    return jwt.sign({user}, process.env.TOKEN_SECRET, {expiresIn: '1800s'});
}

function developmentCheck(req) {
    // Check if the app is running in development mode
    if (process.env.NODE_ENV === 'development') {
        // For development, add a mock user to the request and bypass token verification
        req.user = {id: 1, username: 'dummy'};
        return true
    }
}

exports.validateToken = (req, res, next, needsAdmin = true) =>  {
    const token = req.headers['authorization'];

    if (!token) {
        res.status(401).json({error: 'Token not provided'});
    }
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, wrapper) => {
        if (err) {
            console.error(err);
            res.status(403).json({error: 'Invalid token'});
        }

        const user = await db.User.findOne({where: {username: wrapper.user.username}})

        this.authorization(user, req, res, next, needsAdmin);

    });
}

exports.authorization = (user, req, res, next, needsAdmin) => {
    if (needsAdmin) {
        if (user.roleId !== 4) {
            res.status(403).json({error: 'No access'});
        } else {
            req.user = user
            next()
        }
    } else {
        req.user = user
        next();
    }
}

exports.authenticateTokenForSeller = (req, res, next) => {
    if (developmentCheck(req)) return next();
    this.validateToken(req, res, next, false)
}

exports.authenticateToken = (req, res, next) => {
    if (developmentCheck(req)) return next();
    this.validateToken(req, res, next)
};
