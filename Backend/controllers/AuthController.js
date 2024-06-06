const authService = require("../services/AuthService");

exports.login = async (req, res) => {
    console.log("BODY.USERNAME: " + req.body.username)
    try {
        res.status(200).json(await authService.login(req.body.username));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Service error' });
    }
};
