
const {DataTypes} = require('sequelize');
module.exports = function (sequelize) {

    const OrderProduct = sequelize.define('order_product',
        {
            order_id: {
                type: DataTypes.INTEGER,
            },
            product_id: {
                type: DataTypes.INTEGER,
            },
            quantity: {
                type: DataTypes.INTEGER,
                min: 1,
                allowNull: false,
                default: 1,
            },
        },
    );
    return OrderProduct;
}