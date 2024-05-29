
const {DataTypes} = require('sequelize');
module.exports = function (sequelize) {

    const History = sequelize.define('history',
        {
            action: {
                type: DataTypes.ENUM,
                values: [
                    'increase_product_stock',
                    'decrease_product_stock',
                    'change_credit_value',
                    'change_role',
                    'add_user',
                    'remove_user',
                    'sell_credits',
                    'undo',
                ],
                allowNull: false,
            },
            description: {
                type: DataTypes.JSON,
            },
        },
    );
    return History;
}
