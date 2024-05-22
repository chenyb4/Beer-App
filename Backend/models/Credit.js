
const {DataTypes} = require('sequelize');
module.exports = function (sequelize) {

    const Credit = sequelize.define('credit',
        {
            default_amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
        },
    );
    return Credit;
}