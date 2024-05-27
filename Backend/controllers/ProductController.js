const productService = require('../services/ProductService');

exports.getProducts = async (req, res) => {
    const { id } = req.query;

    try {
        if (id) {
            const product = await productService.getProduct(id);
            res.status(200).json(product);
        } else {
            const products = await productService.getAllProducts();
            res.status(200).json(products);
        }
    } catch (err) {
        res.status(500).json({message: 'Internal Service Error'});
    }

};

exports.createProduct = async (req, res) => {
    const {name, price_in_credits, amount_in_stock, EAN} = req.body;

    try {
        const newProduct = await productService.createProduct(name, price_in_credits, amount_in_stock, EAN);
        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'Bad request'});
    }

};

exports.updateProduct = async (req, res) => {
    const {id, name, price_in_credits, amount_in_stock, EAN} = req.body;

    try {
        res.status(200)
            .json(await productService.updateProduct(
                id, name, price_in_credits, amount_in_stock, EAN)
            );
    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'Bad request'});
    }
};

exports.deleteProduct = async (req, res) => {
    const {id} = req.query;

    try {
        res.status(200).json(await productService.deleteProduct(id));
    } catch (err) {
        res.status(400).json({message: 'Bad request'});
    }
}
