const userService = require('../services/UserService');

exports.getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers(); // Call service method
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Service Error' }); // Handle errors (e.g., validation)
    }
};

exports.createUser = async (req, res) => {
    const { name, email, password } = req.body; // Extract data from request

    try {
        const newUser = await userService.createUser(name, email, password); // Call service method
        res.status(201).json(newUser); // Created (201) response with user data
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Bad request' }); // Handle errors (e.g., validation)
    }
};