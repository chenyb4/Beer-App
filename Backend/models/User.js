const {DataTypes} = require('sequelize');
const {Language} = require('../enums/Language')

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
            language: {
                type: DataTypes.ENUM,
                values:[
                    Language.english,
                    Language.dutch
                ],
                defaultValue: Language.english,
                allowNull: false,
            },
            isDisabled: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            roleId: {
                type: DataTypes.INTEGER,
                defaultValue: 1
            },
            qr_identifier: {
                type: DataTypes.STRING,
                unique: true
            },
        },
    );

    return User;
}
