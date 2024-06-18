const creditService = require('../services/CreditService');
const logger = require("../logger");

exports.getCredit = async (req, res) => {
    try {
        res.status(200).json(await creditService.getCredit());
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: 'Service error' });
    }
};

exports.updateCredit = async (req, res) => {
    const { default_amount, price} = req.body;

    try {
        const updatedCredit = await creditService.updateCredit(default_amount, price)
        if (!updatedCredit) {
            return res.status(404).json({ message: 'Credit not found' });
        }
        res.status(200).json(updatedCredit);
    } catch (err) {
        logger.error(err);
        res.status(400).json({ message: 'Bad request' });
    }
};
