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
            password: {
                type: DataTypes.STRING(64),
            },
            email: {
                type: DataTypes.STRING,
                isEmail: true,
                unique: true,
                allowNull: false,
            },
            credits: {
                type: DataTypes.FLOAT,
                defaultValue: 0.0,
                allowNull: false,
                min: 0,

            },
            date_of_birth: {
                type: DataTypes.DATE,
                allowNull: false
            },
        },
    );

    return User;
}