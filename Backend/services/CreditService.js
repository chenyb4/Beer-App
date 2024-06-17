const db = require('../database');
const logger = require("../logger");

const creditId = 1;

exports.getCredit = async () => {
    return await db.Credit.findByPk(creditId);
};

exports.updateCredit = async (default_amount, price) => {
    if ((!default_amount && !price)) {
        throw new Error('Missing required fields or no update data provided');
    }

    const credit = await this.getCredit()
    if(!credit) {
        return await this.createCredit(default_amount, price)
    } else {
        try {
            return await db.Credit.update(
                {
                    default_amount,
                    price,
                },
                {
                    where: {
                        id: creditId
                    }
                }
            );
        } catch (err) {
            logger.error(err);
            throw new Error('Failed to update credit');
        }
    }



};

exports.createCredit = async (default_amount, price) => {
    if (!default_amount || !price) {
        throw new Error('No credit data available. Creating new Credit => Missing required fields');
    }

    try {
        return await db.Credit.create({id: creditId, default_amount, price});
    } catch (err) {
        logger.error(err);
        throw new Error('No credit data available. Creating new Credit => Failed to create credit');
    }
}
