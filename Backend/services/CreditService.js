const db = require('../database')

exports.getCredit = async () => {
    return await db.Credit.findOne();
};

exports.updateCredit = async (default_amount, price) => {
    if ((!default_amount && !price)) {
        throw new Error('Missing required fields or no update data provided');
    }

    try {
        return await db.Credit.update(
            {
                default_amount,
                price,
            },
            {
                where: {
                    id: 2
                }
            }
        );
    } catch (err) {
        console.error(err);
        throw new Error('Failed to update credit');
    }
};