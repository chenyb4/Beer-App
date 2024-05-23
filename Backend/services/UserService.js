const db = require('../database')

exports.getAllUsers = async () => {
    const users = await db.User.find();
    return users;
};

exports.createUser = async (name, email, password) => {
    // Validation (optional but recommended):
    if (!name || !email || !password) {
        throw new Error('Missing required fields');
    }

    // Password hashing (highly recommended for security):
    const hashedPassword = await bcrypt.hash(password, 10); // Use a suitable hashing library

    const user = new db.User({ name, email, password: hashedPassword });

    try {
        const savedUser = await user.save();
        return savedUser;
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create user'); // Re-throw for error handling in controller
    }
};