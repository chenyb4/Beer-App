const userService = require('../services/UserService');
const paginationService = require('../services/PaginationService')

exports.getUser = async (req, res) => {
    const {id, qr_identifier} = req.query;
    try {
        if (qr_identifier) {
            let user = await userService.getQRUser(qr_identifier);
            user = userService.convertUser(user)
            return res.status(200).json(user);
        } else if (id) {
            let user = await userService.getUser(id);
            user = userService.convertUser(user)
            return res.status(200).json(user);
        } else {
            let {users, total} = await userService.getAllUsers(req)
            users.forEach(u => userService.convertUser(u))
            return res.status(200).json(await paginationService.addPaginationProperties(users, total, req));
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Service error'});
    }
};

exports.createUser = async (req, res) => {
    const {username, email, password, date_of_birth} = req.body;

    try {
        let newUser = await userService.createUser(username, email, password, date_of_birth);
        newUser = userService.convertUser(newUser)
        return res.status(201).json({user: newUser});
    } catch (err) {
        console.error(err);
        return res.status(400).json({message: 'Bad request'});
    }
};

exports.updateUser = async (req, res) => {
    const {id} = req.query;
    let {isDisabled, username, email, credits, date_of_birth, language, roleId} = req.body;
    if (language !== undefined) language = userService.convertLanguage(language);
    try {
        let updatedUser = await userService.updateUser({
            id,
            isDisabled,
            username,
            email,
            credits,
            date_of_birth,
            language,
            roleId,
            loggedInUserId: req.user.id
        });
        if (!updatedUser) {
            return res.status(404).json({message: 'User not found'});
        }
        updatedUser = userService.convertUser(updatedUser)
        return res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        return res.status(400).json({message: 'Bad request'});
    }
};

exports.incrementUserCredits = async (req, res) => {
    const {id} = req.query;
    const {amount} = req.body;


    try {
        if (amount !== undefined && amount <= 0) throw new Error('Amount must be higher than 0');
        const result = await userService.incrementUserCredits(id, amount, req.user.id);
        return res.status(200).json(result)
    } catch (err) {
        console.error(err);
        return res.status(400).json({message: 'Bad request', error: err.message});
    }
}

exports.deleteUser = async (req, res) => {
    const {id} = req.query;

    try {
        const deletedUser = await userService.deleteUser(id);
        return res.status(200).json(deletedUser);
    } catch (err) {
        console.error(err);
        return res.status(400).json({message: 'Bad request'});
    }
}
