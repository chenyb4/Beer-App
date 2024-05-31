const db = require('../database')

exports.getCredit = async () => {
    return await db.Credit.findOne();
};

exports.updateCredit = async (default_amount, price) => {
    if ((!default_amount && !price)) {
        throw new Error('Missing required fields or no update data provided');
    }

    const credit = await this.getCredit()
    if(!credit) {
        return await this.createCredit(default_amount, price, "No credit data available. Creating new Credit => ")
    } else {
        let ids = [1,100];
        try {
            return await db.Credit.update(
                {
                    default_amount,
                    price,
                },
                {
                    where: {
                        id: ids
                    }
                }
            );
        } catch (err) {
            console.error(err);
            throw new Error('Failed to update credit');
        }
    }



};

exports.createCredit = async (default_amount, price, additionalMessage = '') => {
    if (!default_amount || !price) {
        throw new Error(additionalMessage + 'Missing required fields');
    }

    try {
        return await db.Credit.create({default_amount, price});
    } catch (err) {
        console.error(err);
        throw new Error(additionalMessage + 'Failed to create credit');
    }
}