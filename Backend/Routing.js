const productController = require('./controllers/ProductController');
const userController = require('./controllers/UserController');
const orderController = require('./controllers/OrderController');
const historyController = require('./controllers/HistoryController');
const creditController = require('./controllers/CreditController');
const roleController = require('./controllers/RoleController');
const mailService = require('./services/MailService');
const authController = require("./controllers/AuthController");
const authService = require("./services/AuthService");
const dataManagementService = require("./services/DataManagementService");
const logger = require("./logger");

module.exports = function (app) {


    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Get all users
     *     description: Retrieves a list of all users in the system
     *     parameters:
     *       - in: query
     *         name: id
     *         description: Get user by id
     *         type: integer
     *     responses:
     *       200:
     *         description: A successful response containing a list of users, and metadata regarding pagination
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */

    app.get('/users', authService.authenticateToken, userController.getUser);
    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Create a new user
     *     description: Creates a new user in the database
     *     parameters:
     *     - in: body
     *       required: true
     *       schema:
     *         type: object
     *         properties:
     *           username:
     *             type: string
     *             description: The user's name
     *           email:
     *             type: string
     *             description: The user's email
     *           password:
     *             type: string
     *             description: The user's plain password
     *           date_of_birth:
     *             type: string
     *             description: The user's date of birth datetime string
     *     responses:
     *       201:
     *         description: Successfully created a new user
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.post('/users', authService.authenticateToken, userController.createUser);
    /**
     * @swagger
     * /users:
     *   put:
     *     summary: Update a user
     *     description: Updates the user's values in the database
     *     parameters:
     *     - in: query
     *       required: true
     *       name: id
     *       description: The user to be updated
     *       type: integer
     *     - in: body
     *       required: true
     *       schema:
     *         type: object
     *         properties:
     *           username:
     *             type: string
     *             description: The user's name
     *           email:
     *             type: string
     *             description: The user's email
     *           password:
     *             type: string
     *             description: The user's plain password
     *           date_of_birth:
     *             type: string
     *             description: The user's date of birth datetime string
     *           isDisabled:
     *             type: boolean
     *             description: If the user is set to disabled (not used)
     *           credits:
     *             type: int
     *             description: The user's new amount of credits
     *           language:
     *             type: integer
     *             description: The user's new preferred language
     *           roleId:
     *             type: integer
     *             description: The new role of the user
     *     responses:
     *       201:
     *         description: Successfully updated the user.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.put('/users', authService.authenticateToken, userController.updateUser);
    /**
     * @swagger
     * /users/credits:
     *   put:
     *     summary: Increment the users credits
     *     description: Updates the user's values in the database
     *     parameters:
     *     - in: query
     *       required: true
     *       name: id
     *       description: The user to be updated
     *       type: integer
     *     - in: body
     *       required: true
     *       schema:
     *         type: object
     *         properties:
     *           amount:
     *             type: integer
     *             description: The amount of credits to increment on the given user
     *     responses:
     *       201:
     *         description: Successfully incremented the user's credits
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.put('/users/credits', authService.authenticateToken, userController.incrementUserCredits);
    /**
     * @swagger
     * /users:
     *   delete:
     *     summary: Delete the user
     *     description: Delete the user from the database
     *     parameters:
     *     - in: query
     *       required: true
     *       name: id
     *       description: The user to be deleted
     *       type: integer
     *     responses:
     *       200:
     *         description: Successfully deleted the user
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.delete('/users', authService.authenticateToken, userController.deleteUser);

    /**
     * @swagger
     * /orders:
     *   get:
     *     summary: Get all orders
     *     description: Retrieves a list of all orders in the system
     *     parameters:
     *       - in: query
     *         name: id
     *         description: Get detailed order by id
     *         type: integer
     *     responses:
     *       200:
     *         description: A successful response containing a list of orders, and metadata regarding pagination
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.get('/orders', authService.authenticateToken, orderController.getOrder);
    /**
     * @swagger
     * /orders:
     *   post:
     *     summary: Create a new order
     *     description: Creates a new order in the database
     *     parameters:
     *     - in: body
     *       required: true
     *       schema:
     *         type: object
     *         properties:
     *           buyerId:
     *             type: integer
     *             description: The userId of the buyer
     *     responses:
     *       201:
     *         description: Successfully created a new order
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.post('/orders', authService.authenticateTokenForSeller, orderController.createOrder);
    /**
     * @swagger
     * /orders:
     *   put:
     *     summary: Update an order
     *     description: Updates the order's values in the database
     *     parameters:
     *     - in: query
     *       required: true
     *       name: id
     *       description: The order to be updated
     *       type: integer
     *     - in: body
     *       required: true
     *       schema:
     *         type: object
     *         properties:
     *           amount_of_credits:
     *             type: integer
     *             description: The amount of credits the order is worth
     *           buyerId:
     *             type: integer
     *             description: The userId of the buyer
     *           sellerId:
     *             type: integer
     *             description: The userId of the seller
     *     responses:
     *       200:
     *         description: Successfully updated the order.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.put('/orders', authService.authenticateToken, orderController.updateOrder);
    /**
     * @swagger
     * /orders/confirm:
     *   put:
     *     summary: Confirm an order
     *     description: Confirm the order's in the database
     *     parameters:
     *     - in: query
     *       required: true
     *       name: id
     *       description: The order to be confirmed
     *       type: integer
     *     responses:
     *       200:
     *         description: Successfully confirmed the order.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.put('/orders/confirm', authService.authenticateTokenForSeller, orderController.confirmOrder);
    /**
     * @swagger
     * /orders/products:
     *   put:
     *     summary: Add a product to an order
     *     description: Attaches a product to an order
     *     parameters:
     *     - in: query
     *       required: true
     *       name: id
     *       description: The order to be updated
     *       type: integer
     *     - in: body
     *       required: true
     *       schema:
     *         type: object
     *         properties:
     *           productId:
     *             type: integer
     *             description: The id of the product to be added
     *           quantity:
     *             type: integer
     *             description: The amount of the product to be added
     *     responses:
     *       200:
     *         description: Successfully updated the order.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.put('/orders/products', authService.authenticateTokenForSeller, orderController.addProductToOrder)
    /**
     * @swagger
     * /orders:
     *   delete:
     *     summary: Delete the order
     *     description: Delete the order from the database
     *     parameters:
     *     - in: query
     *       required: true
     *       name: id
     *       description: The order to be deleted
     *       type: integer
     *     responses:
     *       200:
     *         description: Successfully deleted the order
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.delete('/orders', authService.authenticateToken, orderController.deleteOrder);

    /**
     * @swagger
     * /histories:
     *   get:
     *     summary: Get all histories
     *     description: Retrieves a list of all histories in the system
     *     parameters:
     *       - in: query
     *         name: id
     *         description: Get detailed history by id
     *         type: integer
     *     responses:
     *       200:
     *         description: A successful response containing a list of histories, and metadata regarding pagination
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.get('/histories', authService.authenticateToken, historyController.getHistory);
    /**
     * @swagger
     * /histories/inventory:
     *   get:
     *     summary: Get all histories regarding inventory
     *     description: Retrieves a list of all histories regarding inventory in the system
     *     parameters:
     *     responses:
     *       200:
     *         description: A successful response containing a list of inventory histories, and metadata regarding pagination
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.get('/histories/inventory', authService.authenticateToken, historyController.getInventoryHistory);
    /**
     * @swagger
     * /histories/undo:
     *   post:
     *     summary: Undoes the last history entry and the associated actions.
     *     description: Creates a new order in the database
     *     parameters:
     *     - in: query
     *       schema:
     *         type: object
     *         properties:
     *           orderId:
     *             description: Undo the order given
     *             type: integer
     *           historyId:
     *             description: Undo the history given
     *             type: integer
     *     responses:
     *       200:
     *         description: Successfully undid the action
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.post('/histories/undo', authService.authenticateToken, historyController.undo);
    /**
     * @swagger
     * /histories:
     *   post:
     *     summary: Create a new history
     *     description: Creates a new history in the database
     *     parameters:
     *     - in: body
     *       required: true
     *       schema:
     *         type: object
     *         properties:
     *           action:
     *             type: integer
     *             description: the action to register
     *           description:
     *             type: object
     *             description: details about the history action
     *           userId:
     *             type: integer
     *             description: userId of the user that performed the action
     *           productId:
     *             type: integer
     *             description: productId of the product associated with the action if necessary
     *     responses:
     *       201:
     *         description: Successfully created a new history
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.post('/histories', authService.authenticateToken, historyController.createHistory);
    /**
     * @swagger
     * /histories:
     *   put:
     *     summary: Update a history entry
     *     description: Updates the histories values in the database
     *     parameters:
     *     - in: query
     *       required: true
     *       name: id
     *       description: The history to be updated
     *       type: integer
     *     - in: body
     *       required: true
     *       schema:
     *         type: object
     *         properties:
     *           action:
     *             type: integer
     *             description: the action to register
     *           description:
     *             type: object
     *             description: details about the history action
     *           userId:
     *             type: integer
     *             description: userId of the user that performed the action
     *     responses:
     *       200:
     *         description: Successfully updated the order.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.put('/histories', authService.authenticateToken, historyController.updateHistory);
    /**
     * @swagger
     * /history:
     *   delete:
     *     summary: Delete the history
     *     description: Delete the history from the database
     *     parameters:
     *     - in: query
     *       required: true
     *       name: id
     *       description: The history to be deleted
     *       type: integer
     *     responses:
     *       200:
     *         description: Successfully deleted the history
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.delete('/histories', authService.authenticateToken, historyController.deleteHistory);

    /**
     * @swagger
     * /credits:
     *   get:
     *     summary: Get the credit
     *     description: Retrieves the credit
     *     responses:
     *       200:
     *         description: Successfully retrieved the credit
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.get('/credits', authService.authenticateToken, creditController.getCredit);
    /**
     * @swagger
     * /credit:
     *   put:
     *     summary: Update the credit
     *     description: Updates the credit values in the database
     *     parameters:
     *     - in: body
     *       required: true
     *       schema:
     *         type: object
     *         properties:
     *          default_amount:
     *             required: true
     *             type: integer
     *             description: the default amount of credits to give for the price.
     *           price:
     *             required: true
     *             type: integer
     *             description: the price to sell the default amount of credits for.
     *     responses:
     *       200:
     *         description: Successfully updated the credit.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.put('/credits', authService.authenticateToken, creditController.updateCredit);

    /**
     * @swagger
     * /roles:
     *   get:
     *     summary: Get all roles
     *     description: Retrieves a list of all roles in the system
     *     parameters:
     *       - in: query
     *         name: id
     *         description: Get role by id
     *         type: integer
     *     responses:
     *       200:
     *         description: A successful response containing a list of roles, and metadata regarding pagination
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.get('/roles', authService.authenticateTokenForSeller, roleController.getRole);
    /**
     * @swagger
     * /roles:
     *   post:
     *     summary: Create a new role
     *     description: Creates a new role in the database
     *     parameters:
     *     - in: body
     *       required: true
     *       schema:
     *         type: object
     *         properties:
     *           name:
     *             type: string
     *             description: The role's name
     *           discount:
     *             type: double
     *             description: the discount sum
     *     responses:
     *       201:
     *         description: Successfully created a new role
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.post('/roles', authService.authenticateToken, roleController.createRole);
    /**
     * @swagger
     * /roles:
     *   put:
     *     summary: Update a role
     *     description: Updates the role's values in the database
     *     parameters:
     *     - in: query
     *       required: true
     *       name: id
     *       description: The role to be updated
     *       type: integer
     *     - in: body
     *       required: true
     *       schema:
     *         type: object
     *         properties:
     *           name:
     *             type: string
     *             description: The role's name
     *           discount:
     *             type: integer
     *             description: the discount sum
     *     responses:
     *       201:
     *         description: Successfully updated the role.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.put('/roles', authService.authenticateToken, roleController.updateRole);
    /**
     * @swagger
     * /roles:
     *   delete:
     *     summary: Delete the role
     *     description: Delete the role from the database
     *     parameters:
     *     - in: query
     *       required: true
     *       name: id
     *       description: The role to be deleted
     *       type: integer
     *     responses:
     *       200:
     *         description: Successfully deleted the role
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.delete('/roles', authService.authenticateToken, roleController.deleteRole);

    /**
     * @swagger
     * /products:
     *   get:
     *     summary: Get all products
     *     description: Retrieves a list of all products in the system
     *     parameters:
     *       - in: query
     *         name: id
     *         description: Get product by id
     *         type: integer
     *     responses:
     *       200:
     *         description: A successful response containing a list of products, and metadata regarding pagination
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.get('/products', authService.authenticateTokenForSeller, productController.getProducts);
    /**
     * @swagger
     * /products:
     *   post:
     *     summary: Create a new product
     *     description: Creates a new product in the database
     *     parameters:
     *     - in: body
     *       required: true
     *       schema:
     *         type: object
     *         properties:
     *           username:
     *             type: string
     *             description: The user's name
     *           email:
     *             type: string
     *             description: The user's email
     *           password:
     *             type: string
     *             description: The user's plain password
     *           date_of_birth:
     *             type: string
     *             description: The user's date of birth datetime string
     *     responses:
     *       201:
     *         description: Successfully created a new user
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.post('/products', authService.authenticateToken, productController.createProduct);
    /**
     * @swagger
     * /products:
     *   put:
     *     summary: Update a product
     *     description: Updates the product's values in the database
     *     parameters:
     *     - in: query
     *       required: true
     *       name: id
     *       description: The product to be updated
     *       type: integer
     *     - in: body
     *       required: true
     *       schema:
     *         type: object
     *         properties:
     *           name:
     *             type: string
     *             description: The product's name
     *           price_in_credits:
     *             type: integer
     *             description: the price of the product in credits
     *           amount_in_stock:
     *             type: integer
     *             description: the amount of stock of this product that is still available
     *           EAN:
     *             type: string
     *             description: The barcode of the product to be scanned
     *     responses:
     *       200:
     *         description: Successfully updated the product.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.put('/products', authService.authenticateToken, productController.updateProduct);
    /**
     * @swagger
     * /products:
     *   delete:
     *     summary: Delete the product
     *     description: Delete the product from the database
     *     parameters:
     *     - in: query
     *       required: true
     *       name: id
     *       description: The product to be deleted
     *       type: integer
     *     responses:
     *       200:
     *         description: Successfully deleted the product
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.delete('/products', authService.authenticateToken, productController.deleteProduct)

    /**
     * @swagger
     * /mail:
     *   post:
     *     summary: Send a QR via mail to the user
     *     description: Generates a qr_identifier for the user and sends an email with a generated qr code to them.
     *     parameters:
     *     - in: query
     *       required: true
     *       name: id
     *       description: The user to send the email to
     *       type: integer
     *     responses:
     *       200:
     *         description: Successfully sent the mail.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.post('/mail', authService.authenticateToken, mailService.mail);

    /**
     * @swagger
     * /login:
     *   post:
     *     summary: Log in to the system as a user
     *     description: Logs in the user if the credentials are correct
     *     parameters:
     *     - in: body
     *       required: true
     *       schema:
     *         type: object
     *         properties:
     *           username:
     *             type: string
     *             description: The name of the user to log in
     *           password:
     *             type: string
     *             description: The password of the user to log in (plaintext)
     *     responses:
     *       200:
     *         description: Successfully logged in the user.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.post('/login', authController.login)
    /**
     * @swagger
     * /register:
     *   post:
     *     summary: Register a new user
     *     description: Registers a new user
     *     parameters:
     *     - in: body
     *       required: true
     *       schema:
     *         type: object
     *         properties:
     *           username:
     *             type: string
     *             description: The name of the user to register
     *           password:
     *             type: string
     *             description: The password of the user to register (plaintext)
     *           email:
     *             type: string
     *             description: The email of the user to register
     *           date_of_birth:
     *             type: string
     *             description: The date of birth of the user to register (datetime string)
     *     responses:
     *       200:
     *         description: Successfully registered the user.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.post('/register', authController.register);

    /**
     * @swagger
     * /loadOldCsv:
     *   get:
     *     summary: Upload data from csv to database
     *     description: Uploads the data from the given csv to the database
     *     responses:
     *       200:
     *         description: Successfully loaded data into database
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.get('/loadOldCsv', async (req, res) => {
        try {
            await dataManagementService.loadCsvOldFormat();
            res.status(200).json("CSV has been loaded");
        } catch (err) {
            logger.error(err);
            res.status(500).json({message: 'Service Error'});
        }
    });
}