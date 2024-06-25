const {parse} = require("csv-parse");
const fs = require("fs");
const db = require("../database");
const logger = require("../logger");

exports.loadCsvOldFormat = async () => {
    try {
        const path = "./Beercards.csv";
        let duplicateUsernames = [];
        let nonNumericUsernames = [];

        await new Promise((resolve, reject) => {
            const parser = parse({delimiter: ",", from_line: 1});
            fs.createReadStream(path).pipe(parser);

            parser.on("data", async (row) => {
                const username = row[0];
                if (username === "") return;
                const email = username + "@student.saxion.nl"

                let roleId = row[1].toLowerCase() === "true" ? 0 : 1;
                let date_of_birth = new Date(row[2]);
                if (isNaN(date_of_birth)) {
                    date_of_birth = new Date();
                }
                let credits = row[3] || 0; // Adjust the index based on your CSV structure

                try {
                    const existingUser = await db.User.findOne({where: {email: email}});
                    if (existingUser) {
                        duplicateUsernames.push(username);
                        console.log("Duplicate: " + email)
                    } else {
                        if (isNaN(username)) {
                            nonNumericUsernames.push(username);
                            console.log("NaN: " + email)
                        } else {
                            await db.User.create({
                                username: username,
                                email: email,
                                password: "", // Handle password assignment as needed
                                date_of_birth: date_of_birth,
                                roleId: roleId,
                                credits: credits
                            });
                        }
                    }
                } catch (err) {
                    console.log(`Error finding user: ${err.message}`);
                }
            });

            parser.on("error", (error) => {
                console.log(error.message);
                reject(error);
            });

            parser.on("end", () => {
                console.log("File read successful");
                resolve({
                    duplicateUsernames: duplicateUsernames,
                    nonNumericUsernames: nonNumericUsernames
                });
            });
        });

        return {
            duplicateUsernames: duplicateUsernames,
            nonNumericUsernames: nonNumericUsernames
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create csv data');
    }
}
exports.loadDummyData = async () => {
    try {
        await db.Role.bulkCreate([
            {
                name: 'member',
                discount: 1.5,
            },
            {
                name: 'student',
                discount: 1
            },
            {
                name: 'seller',
                discount: 1
            },
            {
                name: 'administrator',
                discount: 1
            },

        ]);
        await db.User.bulkCreate([
            {
                username: "dummy",
                email: "510739@student.saxion.nl",
                password: "$2b$10$PhqaHcRo3xnMAX3wyzSF7OmsVoR/7QclpJN9.ePjVHRuMACUsqOZ2",
                date_of_birth: "2024-05-23 00:00:00.000",
                roleId: 4,
                credits: 20
            }, {
                username: "dummy2",
                email: "dummy2@dummy.nl",
                password: "$2b$10$PhqaHcRo3xnMAX3wyzSF7OmsVoR/7QclpJN9.ePjVHRuMACUsqOZ2",
                date_of_birth: "1990-05-23 00:00:00.000",
                roleId: 3,
                credits: 20
            },
        ]);
        await db.Product.create({
            name: 'beer',
            price_in_credits: 1,
            amount_in_stock: 24,
            EAN: '12345678910',
            isAlcoholic: true
        })
        await db.Order.create({
            amount_of_credits: 4,
            buyerId: 2,
            sellerId: 1
        })
        await db.Credit.create({
            default_amount: 10,
            price: 11
        })
    } catch (err) {
        logger.error(err);
        throw new Error('Failed to create dummy data');
    }

}
