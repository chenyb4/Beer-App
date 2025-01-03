const {DataTypes} = require('sequelize');

module.exports = function (sequelize) {
    const Order =  sequelize.define('order',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            amount_of_credits: {
                type: DataTypes.FLOAT,
                min: 0,
                allowNull: false,
                defaultValue: 0,
            },
            buyerId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            sellerId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        },
    );

    return Order;
}