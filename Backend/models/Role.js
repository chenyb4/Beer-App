
const {DataTypes} = require('sequelize');
module.exports = function (sequelize) {

    const Role = sequelize.define('role',
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
            discount: {
                type: DataTypes.FLOAT,
                defaultValue: 1,
                allowNull: false,
            }
        },
    );
    return Role;
}