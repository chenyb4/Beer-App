const {parse} = require("csv-parse");
const fs = require("fs");
const db = require("../database");

exports.loadCsvOldFormat = async () => {
    try {
        const path = "./Beercards.csv";
        let duplicateUsernames = [];
        let nonNumericUsernames = [];

        await new Promise((resolve, reject) => {
            const parser = parse({ delimiter: ",", from_line: 1 });
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
                    const existingUser = await db.User.findOne({ where: { email: email } });
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