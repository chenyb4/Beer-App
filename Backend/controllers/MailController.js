const userService = require("../services/UserService");
const QRService = require("../services/QRService");
exports.sendmail = async (req, res) => {
    const { id } = req.query;

    try {
        const user = await userService.createUserIdentifier(id);
        const qr = await QRService.createQR(user);
        res.status(201).json({qr: qr, sentMail: false});
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Bad request' });
    }
};