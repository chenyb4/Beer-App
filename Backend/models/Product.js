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
                validate: {
                    min: 0,
                },
                defaultValue: 0
            },
            EAN: {
                type: DataTypes.STRING,
                len: [8,13],
            },
            isAlcoholic: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }
        },
    );
    return Product;
}
