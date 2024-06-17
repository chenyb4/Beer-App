const db = require('../database')
const {Language} = require("../enums/Language");

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
            }
        ]);
        await db.User.bulkCreate([
            {
                username: "example",
                email: "example@example.com",
                qr_identifier: 'iahdfo9q34w8yhrtharfiulhas',
                password: "password",
                date_of_birth: "1999-01-01 00:00:00.000",
                roleId: 1
            },
            {
                username: "example2",
                email: "example2@example.com",
                qr_identifier: 'iahdfo9q34w8yhrthasdfrfiulhas',
                password: "password2",
                language: Language.dutch,
                date_of_birth: new Date().setHours(0, 0, 0, 0),
                roleId: 3
            },
            {
                username: "exemplary",
                email: "exemplary@exemplary.com",
                qr_identifier: 'iahdfdsao9q34w8yhrtharfiulhas',
                password: "password_exemplary",
                date_of_birth: new Date().setHours(0, 0, 0, 0),
                roleId: 2
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
            id: 1,
            buyerId: 1,
            sellerId: 2
        })
        await db.Credit.create({
            default_amount: 10,
            price: 11,
            id: 1
        })
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create dummy data');
    }
}