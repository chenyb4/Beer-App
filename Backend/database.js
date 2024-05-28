const process = require("process");
const {Sequelize} = require("sequelize");
const user = process.env.POSTGRES_USER
const password = process.env.PGPASSWORD
const url = process.env.DBURL

const sequelize = new Sequelize('postgres', user, password, {
    host: url,
    dialect: "postgres"
});

const User = require("./models/User")(sequelize)
const Product = require("./models/Product")(sequelize)
const Order = require("./models/Order")(sequelize)
const Order_Product = require("./models/Order_Product")(sequelize)
const History = require("./models/History")(sequelize)
const Credit = require("./models/Credit")(sequelize)
const Role = require("./models/Role")(sequelize)

Product.hasMany(Order_Product)
Order_Product.belongsTo(Product)
Order.hasMany(Order_Product)
Order_Product.belongsTo(Order)

User.hasMany(History)
History.belongsTo(User)
Role.hasMany(User)
User.belongsTo(Role)

User.hasMany(Order, {foreignKey: 'buyerId'})
User.hasMany(Order, {foreignKey: 'sellerId'})

db = {
    sequelize,
    User,
    Product,
    Order,
    Order_Product,
    History,
    Credit,
    Role,
}

module.exports = db