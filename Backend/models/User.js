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
            }
        },
    );

    return User;
}