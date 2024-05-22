
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
                type: DataTypes.ENUM,
                values: [
                  'regular',
                  'member',
                  'board_member'
                ],
                allowNull: false,
            },
            discount: {
                type: DataTypes.FLOAT,
                default: 1,
                allowNull: false,
            }
        },
    );
    return Role;
}