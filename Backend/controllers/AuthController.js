const authService = require("../services/AuthService");
const logger = require("../logger");

exports.login = async (req, res) => {
    const { username, password } = req.body;
    logger.info("This is a test MESSAGE")

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const token = await authService.login(username, password);
        res.status(200).json({ token });
    } catch (err) {
        logger.error(err);
        res.status(401).json({ error: err.message });
    }
};

exports.register = async (req, res) => {
    const { username, password, email, date_of_birth } = req.body;

    if (!username || !password || !email || !date_of_birth) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const token = await authService.register(username, password, email, date_of_birth);
        res.status(201).json({ token });
    } catch (err) {
        logger.error(err);
        res.status(409).json({ error: err.message });
    }
};
