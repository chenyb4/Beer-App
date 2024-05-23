const userService = require('../services/UserService');

exports.getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Service Error' });
    }
};

exports.createUser = async (req, res) => {
    const { username, email, password, date_of_birth } = req.body;

    try {
        const newUser = await userService.createUser(username, email, password, date_of_birth);
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Bad request' });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, credits, date_of_birth } = req.body;

    try {
        const updatedUser = await userService.updateUser(id, username, email, credits, date_of_birth);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Bad request' });
    }
};

exports.deleteUser = async (req, res) => {
    const {id} = req.body;

    try {
        const deletedUser = await userService.deleteUser(id);
        res.status(201).json(deletedUser);
    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'Bad request'});
    }
}