
const {DataTypes} = require('sequelize');
module.exports = function (sequelize) {

    const OrderProduct = sequelize.define('order_product',
        {
            quantity: {
                type: DataTypes.INTEGER,
                min: 1,
                allowNull: false,
                default: 1,
            },
        },
        { timestamps: false },
    );
    return OrderProduct;
}