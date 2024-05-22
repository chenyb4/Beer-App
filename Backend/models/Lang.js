
const {DataTypes} = require('sequelize');
module.exports = function (sequelize) {

    const Lang = sequelize.define('lang',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.ENUM,
                values:[
                    'english',
                    'dutch'
                ],
                allowNull: false,
            },
        },
    );
    return Lang;
}