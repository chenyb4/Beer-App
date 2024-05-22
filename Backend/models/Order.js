const {DataTypes} = require('sequelize');

module.exports = function (sequelize) {
    const Order =  sequelize.define('order',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            transaction_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },
            seller_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            buyer_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            amount_of_credits: {
                type: DataTypes.FLOAT,
                min: 0,
                allowNull: false,
                default: 0,
            },
        },
    );

    return Order;
}