const productService = require('../services/ProductService');

exports.getProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Service Error' });
    }

};

exports.createProduct = async (req, res) => {
    const { name, price_in_credits, amount_in_stock, ean} = req.body;

    try {
        const newProduct = await productService.createProduct(name, price_in_credits, amount_in_stock, ean);
        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Bad request' });
    }

};

exports.getProduct = async (req, res) => {
    const { id } = req.query;

    try {
        const product = await productService.getProduct(id);
        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Bad request' });
    }
}

exports.updateProduct = async (req, res) => {
    const { id, name, price_in_credit, amount_in_stock, ean } = req.body;

    try {
        res.status(200)
            .json(await productService.updateProduct(
                id, name, price_in_credit, amount_in_stock, ean)
            );
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Bad request' });
    }
};
