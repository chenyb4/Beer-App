
const {DataTypes} = require('sequelize');
module.exports = function (sequelize) {

    const History = sequelize.define('history',
        {
            action: {
                type: DataTypes.ENUM,
                values: [
                    'add_product',
                    'remove_product',
                    'change_credit_value',
                    'change_role',
                    'add_user',
                    'remove_user',
                    'sell_credits',
                ],
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
            },
        },
    );
    return History;
}