const {DataTypes} = require('sequelize');

module.exports = function (sequelize) {
    const User =  sequelize.define('user',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                isEmail: true,
                unique: true,
                allowNull: false,
            },
            credits: {
                type: DataTypes.FLOAT,
                allowNull: false,
                min: 0,
                default: 0,
            },
            date_of_birth: {
                type: DataTypes.DATE,
                allowNull: false
            },
        },
    );

    return User;
}