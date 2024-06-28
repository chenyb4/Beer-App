const db = require('../database')
const {Language} = require("../enums/Language");
const {Action} = require("../enums/Action");

exports.cleanTestDatabase = async () => {
    await db.sequelize.sync({force: true});
}

exports.resetTestDatabase = async () => {
    await this.cleanTestDatabase()
    await createTestData();
}

async function createTestData() {
    try {
        await db.Role.bulkCreate([
            {
                id: 1,
                name: 'member',
                discount: 1.5,
            },
            {
                id: 2,
                name: 'student',
                discount: 1
            },
            {
                id: 3,
                name: 'board_member',
                discount: 1.5
            },
            {
                id: 4,
                name: 'administrator',
                discount: 1.5
            }
        ]);
        await db.User.bulkCreate([
            {
                username: "example",
                email: "example@example.com",
                qr_identifier: 'iahdfo9q34wsdf8yhrtharfiulhas',
                password: "$2b$10$PhqaHcRo3xnMAX3wyzSF7OmsVoR/7QclpJN9.ePjVHRuMACUsqOZ2",
                date_of_birth: "1999-01-01 00:00:00.000",
                roleId: 1,
                credits: 0
            },
            {
                username: "example2",
                email: "example2@example.com",
                qr_identifier: 'iasdfahdfo9q34w8yhrthasdfrfiulhas',
                password: "$2b$10$PhqaHcRo3xnMAX3wyzSF7OmsVoR/7QclpJN9.ePjVHRuMACUsqOZ2",
                language: Language.dutch,
                date_of_birth: new Date().setHours(0, 0, 0, 0),
                roleId: 3,
                credits: 0
            },
            {
                username: "exemplary",
                email: "exemplary@exemplary.com",
                qr_identifier: 'iahdfdsao9q34w8yhrtharfifdasulhas',
                password: "$2b$10$PhqaHcRo3xnMAX3wyzSF7OmsVoR/7QclpJN9.ePjVHRuMACUsqOZ2",
                date_of_birth: new Date().setHours(0, 0, 0, 0),
                roleId: 2,
                credits: 0
            },
            {
                username: "exampleAdmin",
                email: "exampleAdmin@example.com",
                qr_identifier: 'iahdfdsao9q34w8yhrthasdfgarfiulhas',
                password: "$2b$10$PhqaHcRo3xnMAX3wyzSF7OmsVoR/7QclpJN9.ePjVHRuMACUsqOZ2",
                date_of_birth: new Date().setHours(0, 0, 0, 0),
                roleId: 4,
                credits: 0
            },
        ]);
        await db.Product.bulkCreate([
            {
                name: 'beer',
                price_in_credits: 1,
                amount_in_stock: 24,
                EAN: '12345678910',
                isAlcoholic: true
            },
            {
                name: 'cola',
                price_in_credits: 1,
                amount_in_stock: 3,
                EAN: '12345578910',
                isAlcoholic: false
            },
        ])
        await db.Order.create({
            buyerId: 1,
            sellerId: 2
        })
        await db.Credit.create({
            default_amount: 10,
            price: 11,
            id: 1
        })
        await db.History.bulkCreate([
            {
                action: Action.decrease_product_stock,
                description: {inventory_change: 2},
                userId: 1,
                productId: 1
            },
            {
                action: Action.increase_product_stock,
                description: {inventory_change: 4},
                userId: 1,
                productId: 1
            },
            {
                action: Action.change_user_credits,
                description: {
                    buyerId: 1,
                    credits: 1,
                    orderId: 1,
                },
                userId: 2,
            },
        ])
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create dummy data');
    }
}