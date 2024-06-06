const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = async (username) => {
    return generateAccessToken({ username: username });
}

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, {expiresIn: '1800s'});
}

exports.authenticateToken= (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    try {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log(err)
                return res.sendStatus(403)
            }
            req.user = user
            next()
        })
    } catch (err) {
        console.log(err);
        throw new Error('Something went wrong while authenticating the token')
    }
}
