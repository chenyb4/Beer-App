const {Action} = require('../enums/Action')
const {DataTypes} = require('sequelize');
module.exports = function (sequelize) {

    const History = sequelize.define('history',
        {
            action: {
                type: DataTypes.ENUM,
                values: [
                    Action.increase_product_stock,
                    Action.decrease_product_stock,
                    Action.change_credit_value,
                    Action.change_role,
                    Action.enable_user,
                    Action.disable_user,
                    Action.sell_credits,
                    Action.undo,
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
