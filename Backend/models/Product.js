const {DataTypes} = require('sequelize');
module.exports = function (sequelize) {

    const Product = sequelize.define('product',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price_in_credits: {
                type: DataTypes.FLOAT,
            },
            amount_in_stock: {
                type: DataTypes.INTEGER,
                min: 0,
            },
            EAN: {
                type: DataTypes.STRING,
                len: [8,13],
            },
        },
    );
    return Product;
}
